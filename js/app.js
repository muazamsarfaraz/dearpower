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
        // Initialize Mapbox with enhanced address selection
        this.mapboxHelper = new MapboxHelper();

        // Set up the geocoder and map
        await this.mapboxHelper.initializeGeocoderWithMap('geocoder-container', 'map-container');

        // Listen for address selection events
        this.mapboxHelper.onAddressSelected = (addressData) => {
            this.handleMapboxAddressSelection(addressData);
        };

        // Listen for precise address selection events
        this.mapboxHelper.onPreciseAddressSelected = (fullAddress) => {
            this.handlePreciseAddressSelection(fullAddress);
        };
    }
    
    async handleMapboxAddressSelection(addressData) {
        console.log('Address selected from Mapbox:', addressData);

        // Store basic address info
        this.userData.address = addressData.place_name;
        this.userData.postcode = this.extractPostcode(addressData.place_name);

        // Show address refinement section
        const refinementSection = document.getElementById('address-refinement');
        refinementSection.classList.remove('d-none');

        // Get nearby addresses for precise selection
        await this.loadNearbyAddresses(addressData.center);

        // Try to get MP data
        if (this.userData.postcode) {
            await this.fetchMPData();
        }
    }

    async loadNearbyAddresses(coordinates) {
        const nearbyContainer = document.getElementById('nearby-addresses');
        nearbyContainer.innerHTML = '<p class="text-muted">Loading nearby addresses...</p>';

        try {
            // Get nearby addresses using reverse geocoding
            const nearbyAddresses = await this.mapboxHelper.getNearbyAddresses(coordinates);

            if (nearbyAddresses.length > 0) {
                nearbyContainer.innerHTML = `
                    <label class="form-label small">Select your exact address:</label>
                    <div class="list-group">
                        ${nearbyAddresses.map((addr, index) => `
                            <button type="button" class="list-group-item list-group-item-action"
                                    data-address="${encodeURIComponent(JSON.stringify(addr))}"
                                    onclick="dearPowerApp.selectPreciseAddress(this)">
                                <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                                ${addr.place_name}
                            </button>
                        `).join('')}
                    </div>
                `;
            } else {
                nearbyContainer.innerHTML = '<p class="text-muted">No nearby addresses found. You can click on the map to select a precise location.</p>';
            }
        } catch (error) {
            console.error('Error loading nearby addresses:', error);
            nearbyContainer.innerHTML = '<p class="text-muted">Unable to load nearby addresses. You can click on the map to select a location.</p>';
        }
    }

    selectPreciseAddress(button) {
        const addressData = JSON.parse(decodeURIComponent(button.dataset.address));
        this.handlePreciseAddressSelection(addressData.place_name);
    }

    handlePreciseAddressSelection(fullAddress) {
        console.log('Precise address selected:', fullAddress);

        // Update user data with full address
        this.userData.address = fullAddress;
        this.userData.postcode = this.extractPostcode(fullAddress);

        // Show confirmation
        const confirmedAddressText = document.getElementById('confirmed-full-address-text');
        const selectedAddressDisplay = document.getElementById('selected-full-address');

        confirmedAddressText.textContent = fullAddress;
        selectedAddressDisplay.classList.remove('d-none');

        // Fetch MP data if we don't have it yet
        if (!this.userData.mp && this.userData.postcode) {
            this.fetchMPData();
        }
    }

    extractPostcode(address) {
        // Extract UK postcode from address string
        const postcodeRegex = /([A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})/i;
        const match = address.match(postcodeRegex);
        return match ? match[1].toUpperCase() : null;
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
            await this.fetchMPDataByConstituency();
        } catch (error) {
            console.error('Error fetching MP data:', error);
            this.showError('Unable to find MP information for this address.');
        }
    }

    async fetchMPDataByConstituency() {
        if (!this.userData.constituency) {
            console.log('No constituency available, skipping MP lookup');
            return;
        }

        try {
            console.log('Looking up MP for constituency:', this.userData.constituency);
            const mpData = await API.getMPByConstituency(this.userData.constituency);
            this.userData.mp = mpData;
            console.log('Found MP:', mpData);

            // Update UI with MP info and show Next button
            this.displayMPInfo(true);
        } catch (error) {
            console.error('Error fetching MP data by constituency:', error);
            this.showError('Unable to find MP information for this constituency.');
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

// Email editing functions (global scope for onclick handlers)
window.toggleEmailEdit = function() {
    const previewDisplay = document.getElementById('email-preview-display');
    const editMode = document.getElementById('email-edit-mode');

    previewDisplay.classList.add('d-none');
    editMode.classList.remove('d-none');

    // Focus on textarea
    document.getElementById('email-edit-textarea').focus();
};

window.saveEmailEdit = function() {
    const textarea = document.getElementById('email-edit-textarea');
    const newContent = textarea.value;

    // Update the app's email content
    if (window.dearPowerApp) {
        window.dearPowerApp.userData.emailContent = newContent;
    }

    // Update the preview display with new content
    const htmlContent = Components.markdownToHtml(newContent);
    document.querySelector('.email-content-html').innerHTML = htmlContent;

    // Switch back to preview mode
    const previewDisplay = document.getElementById('email-preview-display');
    const editMode = document.getElementById('email-edit-mode');

    editMode.classList.add('d-none');
    previewDisplay.classList.remove('d-none');

    // Show success message
    if (window.dearPowerApp) {
        window.dearPowerApp.showSuccess('Email updated successfully!');
    }
};

window.cancelEmailEdit = function() {
    // Reset textarea to original content
    const textarea = document.getElementById('email-edit-textarea');
    if (window.dearPowerApp) {
        textarea.value = window.dearPowerApp.userData.emailContent;
    }

    // Hide preview if visible
    hideMarkdownPreview();

    // Switch back to preview mode
    const previewDisplay = document.getElementById('email-preview-display');
    const editMode = document.getElementById('email-edit-mode');

    editMode.classList.add('d-none');
    previewDisplay.classList.remove('d-none');
};

// Rich text formatting functions
window.insertMarkdown = function(before, after) {
    const textarea = document.getElementById('email-edit-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let replacement;
    if (selectedText) {
        // Wrap selected text
        replacement = before + selectedText + after;
    } else {
        // Insert placeholder text
        const placeholder = before === '**' ? 'bold text' :
                          before === '*' ? 'italic text' :
                          before === '### ' ? 'Header Text' : 'text';
        replacement = before + placeholder + after;
    }

    // Replace text
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    // Set cursor position
    const newCursorPos = selectedText ? start + replacement.length : start + before.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos + (selectedText ? 0 : replacement.length - before.length - after.length));
    textarea.focus();
};

window.insertList = function(type) {
    const textarea = document.getElementById('email-edit-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let replacement;
    if (selectedText) {
        // Convert selected lines to list
        const lines = selectedText.split('\n');
        const listItems = lines.map((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            return type === 'numbered' ? `${index + 1}. ${trimmed}` : `- ${trimmed}`;
        }).join('\n');
        replacement = listItems;
    } else {
        // Insert sample list
        if (type === 'numbered') {
            replacement = '1. First item\n2. Second item\n3. Third item';
        } else {
            replacement = '- First item\n- Second item\n- Third item';
        }
    }

    // Add line breaks if needed
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    const needsBreakBefore = beforeText && !beforeText.endsWith('\n');
    const needsBreakAfter = afterText && !afterText.startsWith('\n');

    const finalReplacement = (needsBreakBefore ? '\n' : '') + replacement + (needsBreakAfter ? '\n' : '');

    // Replace text
    textarea.value = beforeText + finalReplacement + afterText;

    // Set cursor position
    const newCursorPos = start + finalReplacement.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
};

window.insertLineBreak = function() {
    const textarea = document.getElementById('email-edit-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const replacement = '\n\n';

    // Insert line break
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(start);

    // Set cursor position
    textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    textarea.focus();
};

window.previewMarkdown = function() {
    const textarea = document.getElementById('email-edit-textarea');
    const previewDiv = document.getElementById('markdown-preview');
    const previewContent = document.getElementById('markdown-preview-content');

    if (!textarea || !previewDiv || !previewContent) return;

    // Convert markdown to HTML
    const htmlContent = Components.markdownToHtml(textarea.value);
    previewContent.innerHTML = htmlContent;

    // Show preview
    previewDiv.classList.remove('d-none');
};

window.hideMarkdownPreview = function() {
    const previewDiv = document.getElementById('markdown-preview');
    if (previewDiv) {
        previewDiv.classList.add('d-none');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dearPowerApp = new DearPowerApp();
});