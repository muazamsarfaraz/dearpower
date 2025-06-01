// Main application module
import { API } from './api.js';
import { Components } from './components.js';
import { MapboxHelper } from './mapbox.js';
import { OpenAIHelper } from './openai.js';

class DearPowerApp {
    constructor() {
        this.currentStep = 1;
        this.userData = {
            address: null,
            postcode: null,
            constituency: null,
            mp: null,
            topic: null,
            reference: null,
            emailContent: null
        };
        
        this.init();
    }
    
    init() {
        // Initialize the app
        this.loadStep(1);
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Global event listeners
        document.addEventListener('click', (e) => {
            // Handle step navigation
            if (e.target.closest('[data-action]')) {
                const action = e.target.closest('[data-action]').dataset.action;
                this.handleAction(action, e.target);
            }
        });
    }
    
    handleAction(action, target) {
        switch(action) {
            case 'start':
                this.loadStep(2);
                break;
            case 'select-address':
                this.handleAddressSelection(target.dataset);
                break;
            case 'continue-to-compose':
                this.loadStep(3);
                break;
            case 'select-topic':
                this.handleTopicSelection(target);
                break;
            case 'generate-email':
                this.generateEmail();
                break;
            case 'review-email':
                this.loadStep(4);
                break;
            case 'copy-email':
                this.copyEmail();
                break;
            case 'send-email':
                this.sendEmail();
                break;
            case 'start-over':
                this.resetApp();
                break;
        }
    }
    
    async loadStep(step) {
        this.currentStep = step;
        this.updateProgress(step);
        
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = '';
        contentArea.classList.add('fade-in');
        
        switch(step) {
            case 1:
                contentArea.innerHTML = Components.welcomeScreen();
                break;
            case 2:
                contentArea.innerHTML = Components.addressSearchScreen(false);
                await this.initializeMapbox();
                break;
            case 3:
                contentArea.innerHTML = Components.emailComposerScreen(this.userData);
                // Add event listener for name input validation
                setTimeout(() => {
                    const nameInput = document.getElementById('user-full-name');
                    if (nameInput) {
                        nameInput.addEventListener('input', () => this.validateEmailForm());
                    }
                }, 100);
                break;
            case 4:
                contentArea.innerHTML = Components.reviewScreen(this.userData);
                break;
        }
    }
    
    updateProgress(step) {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            if (index + 1 < step) {
                stepEl.classList.add('completed');
            } else if (index + 1 === step) {
                stepEl.classList.add('active');
            }
        });
    }
    
    async initializeMapbox() {
        const geocoder = await MapboxHelper.createGeocoder();
        document.getElementById('geocoder-container').appendChild(geocoder.onAdd());
        
        // Initialize map
        const map = await MapboxHelper.createMap('map-container');
        
        // Handle geocoder results
        geocoder.on('result', async (e) => {
            this.showLoading();
            
            // Store address data
            this.userData.address = e.result.place_name;
            this.userData.postcode = this.extractPostcode(e.result);
            
            // Update map
            MapboxHelper.updateMapLocation(map, e.result.center);
            
            // Fetch MP data
            await this.fetchMPData();
            
            this.hideLoading();
        });
    }
    
    extractPostcode(result) {
        console.log('Mapbox result:', result);

        // Extract postcode from Mapbox result
        const postcodeContext = result.context?.find(c => c.id.includes('postcode'));
        let postcode = postcodeContext?.text || '';

        // If no postcode found in context, try to extract from place_name
        if (!postcode && result.place_name) {
            // UK postcode regex pattern
            const postcodeRegex = /\b[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}\b/i;
            const match = result.place_name.match(postcodeRegex);
            if (match) {
                postcode = match[0].trim().toUpperCase();
            }
        }

        console.log('Extracted postcode:', postcode);
        return postcode;
    }
    
    async fetchMPData() {
        console.log('fetchMPData called with postcode:', this.userData.postcode);

        if (!this.userData.postcode) {
            console.log('No postcode available, skipping MP lookup');
            return;
        }

        try {
            console.log('Looking up constituency for postcode:', this.userData.postcode);

            // Get constituency from postcode
            const constituencyData = await API.getConstituencyByPostcode(this.userData.postcode);
            this.userData.constituency = constituencyData.result.name;
            console.log('Found constituency:', this.userData.constituency);

            // Get MP data
            console.log('Looking up MP for constituency:', this.userData.constituency);
            const mpData = await API.getMPByConstituency(this.userData.constituency);
            this.userData.mp = mpData;
            console.log('Found MP:', mpData);

            // Update UI with MP info and show Next button
            this.displayMPInfo(true);
        } catch (error) {
            console.error('Error fetching MP data:', error);
            this.showError('Unable to find MP information for this address.');
        }
    }
    
    displayMPInfo(showNextButton = false) {
        const mpContainer = document.getElementById('mp-info-container');
        if (mpContainer && this.userData.mp) {
            // Do not show continue button in MP card in address step
            mpContainer.innerHTML = Components.mpCard(this.userData.mp, false);
            mpContainer.classList.remove('d-none');
        }
        // Show Next button under the map if requested
        const nextBtnContainer = document.getElementById('next-btn-container');
        if (nextBtnContainer && showNextButton) {
            nextBtnContainer.classList.remove('d-none');
        }
    }
    
    handleAddressSelection(dataset) {
        // This method handles address selection from search results
        // Address data is already stored in geocoder result handler
        console.log('Address selected:', dataset);
    }

    handleTopicSelection(target) {
        // Remove previous selection
        document.querySelectorAll('.topic-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Add selection
        target.classList.add('selected');
        this.userData.topic = target.dataset.topic;

        // Enable generate button if name is also provided
        this.validateEmailForm();
    }

    validateEmailForm() {
        const nameInput = document.getElementById('user-full-name');
        const generateBtn = document.getElementById('generate-email-btn');

        if (generateBtn && nameInput) {
            const hasName = nameInput.value.trim().length > 0;
            const hasTopic = this.userData.topic;
            generateBtn.disabled = !(hasName && hasTopic);
        }
    }
    
    async generateEmail() {
        // Capture user inputs
        const referenceInput = document.getElementById('reference-link');
        const nameInput = document.getElementById('user-full-name');

        this.userData.reference = referenceInput?.value || '';
        this.userData.fullName = nameInput?.value.trim() || '';

        // Validate required fields
        if (!this.userData.fullName) {
            this.showError('Please enter your full name before generating the email.');
            return;
        }

        if (!this.userData.topic) {
            this.showError('Please select a topic before generating the email.');
            return;
        }

        // Show generating state
        const previewContainer = document.getElementById('email-preview-container');
        previewContainer.innerHTML = Components.aiGenerating();

        try {
            // Generate email with OpenAI
            const emailContent = await OpenAIHelper.generateEmail({
                mp: this.userData.mp,
                topic: this.userData.topic,
                reference: this.userData.reference,
                constituency: this.userData.constituency,
                fullName: this.userData.fullName,
                address: this.userData.address
            });
            
            this.userData.emailContent = emailContent;
            
            // Display generated email
            previewContainer.innerHTML = Components.emailPreview(emailContent);
            
            // Enable review button
            document.getElementById('review-email-btn').classList.remove('d-none');
        } catch (error) {
            console.error('Error generating email:', error);
            this.showError('Unable to generate email. Please try again.');
        }
    }
    
    copyEmail() {
        const emailText = this.userData.emailContent;
        navigator.clipboard.writeText(emailText).then(() => {
            this.showSuccess('Email copied to clipboard!');
        }).catch(err => {
            console.error('Error copying email:', err);
            this.showError('Unable to copy email. Please select and copy manually.');
        });
    }
    
    sendEmail() {
        const mpEmail = this.userData.mp.email;
        const subject = encodeURIComponent(`Important: ${this.userData.topic}`);
        const body = encodeURIComponent(this.userData.emailContent);
        
        window.location.href = `mailto:${mpEmail}?subject=${subject}&body=${body}`;
    }
    
    resetApp() {
        this.userData = {
            address: null,
            postcode: null,
            constituency: null,
            mp: null,
            topic: null,
            reference: null,
            fullName: null,
            emailContent: null
        };
        this.loadStep(1);
    }
    
    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('d-none');
    }
    
    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('d-none');
    }
    
    showError(message) {
        // TODO: Implement toast notification
        alert(message);
    }
    
    showSuccess(message) {
        // TODO: Implement toast notification
        alert(message);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DearPowerApp();
}); 