// Script to list all available OpenAI models via API
// This will help us see what models are currently available

require('dotenv').config();

async function listOpenAIModels() {
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        console.log('Available OpenAI Models:');
        console.log('========================');
        
        // Sort models by ID for better readability
        const sortedModels = data.data.sort((a, b) => a.id.localeCompare(b.id));
        
        // Group models by type for better organization
        const modelGroups = {
            'GPT-4o': [],
            'GPT-4': [],
            'GPT-3.5': [],
            'o1': [],
            'Embedding': [],
            'TTS': [],
            'Whisper': [],
            'DALL-E': [],
            'Other': []
        };
        
        sortedModels.forEach(model => {
            const id = model.id;
            if (id.includes('gpt-4o')) {
                modelGroups['GPT-4o'].push(model);
            } else if (id.includes('gpt-4')) {
                modelGroups['GPT-4'].push(model);
            } else if (id.includes('gpt-3.5')) {
                modelGroups['GPT-3.5'].push(model);
            } else if (id.includes('o1')) {
                modelGroups['o1'].push(model);
            } else if (id.includes('embedding') || id.includes('ada')) {
                modelGroups['Embedding'].push(model);
            } else if (id.includes('tts')) {
                modelGroups['TTS'].push(model);
            } else if (id.includes('whisper')) {
                modelGroups['Whisper'].push(model);
            } else if (id.includes('dall-e')) {
                modelGroups['DALL-E'].push(model);
            } else {
                modelGroups['Other'].push(model);
            }
        });
        
        // Display models by group
        Object.entries(modelGroups).forEach(([groupName, models]) => {
            if (models.length > 0) {
                console.log(`\n${groupName} Models:`);
                console.log('-'.repeat(groupName.length + 8));
                models.forEach(model => {
                    console.log(`  • ${model.id}`);
                    if (model.owned_by && model.owned_by !== 'openai') {
                        console.log(`    (owned by: ${model.owned_by})`);
                    }
                });
            }
        });
        
        console.log(`\nTotal models available: ${data.data.length}`);
        
        // Show recommended models for different use cases
        console.log('\n🎯 Recommended Models for Different Use Cases:');
        console.log('==============================================');
        console.log('💬 Chat/Text Generation:');
        console.log('  • gpt-4o (latest, most capable)');
        console.log('  • gpt-4o-mini (cost-effective, fast)');
        console.log('  • gpt-4-turbo (previous generation)');
        
        console.log('\n🧠 Reasoning Tasks:');
        console.log('  • o1-preview (advanced reasoning)');
        console.log('  • o1-mini (faster reasoning)');
        
        console.log('\n💰 Cost-Effective Options:');
        console.log('  • gpt-4o-mini (best balance of cost/performance)');
        console.log('  • gpt-3.5-turbo (legacy, very cheap)');
        
    } catch (error) {
        console.error('Error fetching models:', error.message);
        
        if (error.message.includes('401')) {
            console.error('❌ Authentication failed. Please check your OPENAI_API_KEY in .env file');
        } else if (error.message.includes('403')) {
            console.error('❌ Access forbidden. Your API key may not have the required permissions');
        } else if (error.message.includes('429')) {
            console.error('❌ Rate limit exceeded. Please try again later');
        }
    }
}

// Run the script
listOpenAIModels();
