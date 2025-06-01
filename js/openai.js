// OpenAI helper module for email generation

export const OpenAIHelper = {
    // Backend API URL for email generation
    API_URL: '/api/generate-email',

    // Generate email content using OpenAI o1-mini via backend
    async generateEmail({ mp, topic, reference, constituency, fullName, address }) {
        try {
            // Try to generate email via backend API
            return await this.callBackendAPI({ mp, topic, reference, constituency, fullName, address });
        } catch (error) {
            console.error('Error generating email via backend:', error);
            // Fallback to template
            return this.generateTemplateEmail({ mp, topic, reference, constituency });
        }
    },
    
    // Call backend API for email generation
    async callBackendAPI({ mp, topic, reference, constituency, fullName, address }) {
        const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mp,
                topic,
                reference,
                constituency,
                fullName,
                address
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Backend API request failed: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        return data.emailContent;
    },
    
    // Generate template-based email
    generateTemplateEmail({ mp, topic, reference, constituency }) {
        const greeting = mp.gender === 'F' ? 'Dear Ms' : 'Dear Mr';
        const lastName = mp.name.split(' ').pop();
        
        const templates = {
            'Cost of Living': `${greeting} ${lastName},

I am writing to you as your constituent in ${constituency} to express my deep concern about the rising cost of living affecting families across our community.

Many of us are struggling with increased prices for essentials like food, energy, and housing. The situation has become increasingly difficult for working families, pensioners, and those on fixed incomes.

${reference ? `I recently read an article that highlights these concerns: ${reference}\n\n` : ''}I urge you to:
- Support measures to help families with energy costs
- Push for action on food price inflation
- Advocate for increased support for those most affected

As my representative in Parliament, I hope you will raise these concerns and work towards practical solutions that will help your constituents.

Thank you for your time and consideration. I look forward to hearing about the actions you will take on this important issue.

Yours sincerely,
[Your name]`,

            'Healthcare': `${greeting} ${lastName},

As your constituent in ${constituency}, I am writing to express my concerns about the state of healthcare services in our area.

${reference ? `I recently came across this article which highlights some of these issues: ${reference}\n\n` : ''}Our NHS is under tremendous pressure, with long waiting times, staff shortages, and inadequate funding affecting patient care. This is impacting real people in our constituency who need timely medical attention.

I respectfully urge you to:
- Advocate for increased NHS funding
- Support measures to recruit and retain healthcare workers
- Push for improvements to local healthcare services

Your voice in Parliament can make a real difference in addressing these critical issues.

Thank you for representing our interests. I would appreciate hearing about your stance on these matters and what actions you plan to take.

Yours sincerely,
[Your name]`,

            'Education': `${greeting} ${lastName},

I am contacting you as a concerned constituent in ${constituency} regarding the state of education in our area.

${reference ? `This article reflects many of my concerns: ${reference}\n\n` : ''}Schools in our constituency are facing significant challenges, including funding pressures, teacher shortages, and inadequate resources. Our children's future depends on the quality of education they receive today.

I urge you to:
- Support increased funding for schools
- Advocate for better teacher pay and conditions
- Push for improved educational resources and facilities

As our representative, your advocacy on these issues is crucial for our community's future.

I look forward to hearing about your position on these matters and the steps you will take to support education in ${constituency}.

Yours sincerely,
[Your name]`,

            'Environment': `${greeting} ${lastName},

As your constituent in ${constituency}, I am writing to express my concern about environmental issues and climate change.

${reference ? `I was prompted to write after reading: ${reference}\n\n` : ''}The climate crisis requires urgent action, and I believe our constituency should be leading the way in environmental protection and sustainable practices.

I urge you to:
- Support stronger climate legislation
- Advocate for renewable energy investment
- Push for better public transport and cycling infrastructure
- Champion local environmental initiatives

Your leadership on these issues in Parliament is essential for our collective future.

Thank you for your time. I hope to see you taking strong action on environmental matters.

Yours sincerely,
[Your name]`,

            'Housing': `${greeting} ${lastName},

I am writing as your constituent in ${constituency} to raise concerns about the housing crisis affecting our community.

${reference ? `This recent article highlights the severity of the situation: ${reference}\n\n` : ''}Many people in our constituency are struggling with high rents, unable to afford homes, or living in substandard conditions. This crisis is affecting families, young people, and vulnerable members of our community.

I urge you to:
- Support measures to increase affordable housing
- Advocate for stronger tenant protections
- Push for action on homelessness
- Champion sustainable development in our area

Your voice in Parliament can help address this critical issue affecting so many of your constituents.

I look forward to hearing about your plans to tackle the housing crisis.

Yours sincerely,
[Your name]`,

            'Other': `${greeting} ${lastName},

As your constituent in ${constituency}, I am writing to bring an important matter to your attention.

${reference ? `I would like to draw your attention to this article: ${reference}\n\n` : ''}This issue is of significant concern to me and many others in our constituency. It affects our daily lives and the wellbeing of our community.

I respectfully urge you to:
- Investigate this matter thoroughly
- Raise it in Parliament
- Work towards practical solutions
- Keep your constituents informed of progress

As our elected representative, your action on this matter is crucial.

Thank you for your time and attention. I look forward to your response and learning about the steps you will take.

Yours sincerely,
[Your name]`
        };
        
        return templates[topic] || templates['Other'];
    }
};