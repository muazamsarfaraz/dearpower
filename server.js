require('dotenv').config();
const express = require('express');
const path = require('path');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Serve static files from the current directory
app.use(express.static('.'));

// Function to fetch and parse article content from URL
async function fetchArticleContent(url) {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol');
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .advertisement, .ads, .social-share').remove();

    // Try to extract the main content
    let title = '';
    let content = '';

    // Extract title
    title = $('h1').first().text().trim() ||
            $('title').text().trim() ||
            $('meta[property="og:title"]').attr('content') || '';

    // Try different selectors for main content
    const contentSelectors = [
      'article',
      'main',
      '.content',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.story-body',
      '.article-body'
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        break;
      }
    }

    // Fallback: get all paragraph text
    if (!content) {
      content = $('p').map((i, el) => $(el).text().trim()).get().join('\n\n');
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n\n') // Clean up line breaks
      .trim();

    // Limit content length to avoid token limits (approximately 3000 words)
    if (content.length > 12000) {
      content = content.substring(0, 12000) + '...';
    }

    return {
      title: title.substring(0, 200), // Limit title length
      content: content,
      url: url
    };

  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error(`Failed to fetch article: ${error.message}`);
  }
}

// API endpoint for generating emails with OpenAI
app.post('/api/generate-email', async (req, res) => {
  try {
    const { mp, topic, reference, constituency } = req.body;

    // Validate required fields
    if (!mp || !topic || !constituency) {
      return res.status(400).json({
        error: 'Missing required fields: mp, topic, and constituency are required'
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key not configured on server'
      });
    }

    // Fetch article content if reference URL is provided
    let articleContent = null;
    if (reference) {
      try {
        console.log('Fetching article content from:', reference);
        articleContent = await fetchArticleContent(reference);
        console.log('Article fetched successfully:', articleContent.title);
      } catch (error) {
        console.error('Failed to fetch article:', error.message);
        // Continue without article content - will use URL as fallback
      }
    }

    // Prepare the prompt for o1-mini
    let combinedPrompt = `You are an expert at writing effective, polite, and persuasive letters to Members of Parliament in the UK.

Write a formal but personable email that:
- Is respectful and professional
- Clearly states the issue and why it matters
- Includes specific asks or actions
- References the constituent's connection to the constituency
- Is concise (under 300 words)
${reference ? '- Incorporates the provided reference material appropriately and references specific points from the article' : ''}

Please write an email to ${mp.name}, MP for ${constituency}, about ${topic}.`;

    if (articleContent) {
      combinedPrompt += `

Reference this article content in your email:
Title: ${articleContent.title}
URL: ${articleContent.url}
Content: ${articleContent.content}

Please reference specific points, statistics, or concerns mentioned in this article to make the email more compelling and well-informed.`;
    } else if (reference) {
      combinedPrompt += `

Reference this article/material: ${reference}`;
    }

    combinedPrompt += `

The email should be from a constituent concerned about this issue.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'o1-mini',
        messages: [
          { role: 'user', content: combinedPrompt }
        ],
        max_completion_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return res.status(500).json({
        error: 'Failed to generate email with OpenAI API'
      });
    }

    const data = await response.json();
    const emailContent = data.choices?.[0]?.message?.content || '';

    res.json({
      emailContent,
      articleFetched: !!articleContent,
      articleTitle: articleContent?.title || null,
      articleUrl: articleContent?.url || reference || null
    });

  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({
      error: 'Internal server error while generating email'
    });
  }
});

// Handle SPA routing - serve index.html for all routes that don't match static files
app.get('*', (req, res) => {
  // Don't serve index.html for API calls or file extensions
  if (req.path.includes('.') || req.path.startsWith('/api')) {
    return res.status(404).send('Not found');
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DearPower server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
