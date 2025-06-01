require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Serve static files from the current directory
app.use(express.static('.'));

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

    // Prepare the prompt for o1-mini
    const combinedPrompt = `You are an expert at writing effective, polite, and persuasive letters to Members of Parliament in the UK.

Write a formal but personable email that:
- Is respectful and professional
- Clearly states the issue and why it matters
- Includes specific asks or actions
- References the constituent's connection to the constituency
- Is concise (under 300 words)
${reference ? '- Incorporates the provided reference material appropriately' : ''}

Please write an email to ${mp.name}, MP for ${constituency}, about ${topic}.
${reference ? `Reference this article/material: ${reference}` : ''}

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

    res.json({ emailContent });

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
