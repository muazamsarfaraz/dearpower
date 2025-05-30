// Playwright test script for DearPower application

const { chromium } = require('playwright');

async function testDearPower() {
    console.log('Starting DearPower automated test...');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] // To avoid CORS issues during testing
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Enable console logging
    page.on('console', msg => console.log('Browser console:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('Page error:', err));
    
    try {
        // Step 1: Navigate to the app
        console.log('1. Navigating to application...');
        await page.goto('http://localhost:8000/index-new.html');
        await page.waitForLoadState('networkidle');
        
        // Step 2: Click Get Started
        console.log('2. Clicking Get Started...');
        await page.click('button[data-action="start"]');
        await page.waitForTimeout(2000);
        
        // Step 3: Try manual postcode entry (bypassing Mapbox geocoder for now)
        console.log('3. Testing with manual postcode entry...');
        
        // Check if we can manually trigger the MP lookup
        const testPostcode = 'SW1A 2AA';
        console.log(`   Testing with postcode: ${testPostcode}`);
        
        // Execute the lookup directly
        const result = await page.evaluate(async (postcode) => {
            try {
                // Access the app instance
                if (window.app) {
                    window.app.userData.postcode = postcode;
                    await window.app.fetchMPData();
                    return {
                        success: true,
                        mp: window.app.userData.mp,
                        constituency: window.app.userData.constituency
                    };
                }
                return { success: false, error: 'App not found' };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }, testPostcode);
        
        console.log('   MP Lookup result:', result);
        
        // Take screenshot
        await page.screenshot({ path: 'test-mp-result.png' });
        
        // If MP found, continue to compose
        if (result.success && result.mp) {
            console.log(`   Found MP: ${result.mp.name} (${result.mp.party})`);
            
            // Click continue button if it exists
            const continueButton = await page.$('button[data-action="continue-to-compose"]');
            if (continueButton) {
                console.log('4. Continuing to compose message...');
                await continueButton.click();
                await page.waitForTimeout(2000);
                
                // Select a topic
                console.log('5. Selecting topic...');
                await page.click('[data-action="select-topic"][data-topic="Healthcare"]');
                
                // Add reference
                console.log('6. Adding reference link...');
                await page.fill('#reference-link', 'https://www.bbc.co.uk/news/health');
                
                // Generate email
                console.log('7. Generating email...');
                await page.click('#generate-email-btn');
                await page.waitForTimeout(3000);
                
                // Take final screenshot
                await page.screenshot({ path: 'test-email-generated.png' });
                
                console.log('Test completed successfully!');
            }
        }
        
    } catch (error) {
        console.error('Test failed:', error);
        await page.screenshot({ path: 'test-error.png' });
    } finally {
        await browser.close();
    }
}

// Run the test
testDearPower().catch(console.error); 