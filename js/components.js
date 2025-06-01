// UI Components module

export const Components = {
    // Welcome screen component
    welcomeScreen() {
        return `
            <div class="welcome-hero">
                <h1>Contact Your MP</h1>
                <p class="lead">
                    DearPower makes it easy to write to your Member of Parliament. 
                    We'll help you find your MP, compose an effective message, and send it directly.
                </p>
                
                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-search-location"></i>
                        </div>
                        <h5>Find Your MP</h5>
                        <p class="text-muted">Enter your address and we'll automatically find your local representative</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <h5>AI-Powered Writing</h5>
                        <p class="text-muted">Get help composing your message with AI that understands effective communication</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-paper-plane"></i>
                        </div>
                        <h5>Send Directly</h5>
                        <p class="text-muted">Send your message via email or copy it to send through other channels</p>
                    </div>
                </div>
                
                <button class="btn btn-primary btn-lg" data-action="start">
                    <i class="fas fa-arrow-right"></i>
                    Get Started
                </button>
            </div>
        `;
    },
    
    // Address search screen
    addressSearchScreen(showNextButton = false) {
        return `
            <div class="address-search-container">
                <h2 class="text-center mb-4">Find Your MP</h2>
                <p class="text-center text-muted mb-5">
                    Enter your address or postcode to find your local Member of Parliament
                </p>

                <div class="card">
                    <div class="card-body p-4">
                        <div id="geocoder-container" class="mb-4"></div>
                        <div id="map-container" class="map-preview"></div>

                        <!-- Address refinement section -->
                        <div id="address-refinement" class="mt-4 d-none">
                            <h6 class="mb-3">
                                <i class="fas fa-map-marker-alt me-2"></i>
                                Select your exact address
                            </h6>
                            <p class="text-muted small mb-3">
                                Click on the map or select from nearby addresses to get your full door address
                            </p>
                            <div id="nearby-addresses" class="mb-3"></div>
                            <div id="selected-full-address" class="d-none">
                                <div class="alert alert-success">
                                    <h6 class="mb-2"><i class="fas fa-check-circle me-2"></i>Full Address Confirmed</h6>
                                    <div id="confirmed-full-address-text"></div>
                                </div>
                            </div>
                        </div>

                        <div id="mp-info-container" class="mt-4 d-none"></div>
                        <div id="next-btn-container" class="text-center mt-4 ${showNextButton ? '' : 'd-none'}">
                            <button class="btn btn-primary" id="next-to-compose-btn" data-action="continue-to-compose">
                                Next <i class="fas fa-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // MP card component
    mpCard(mp, showContinueBtn = false) {
        const partyClass = `party-${mp.partyAbbreviation.toLowerCase().replace(/\s+/g, '-')}`;
        
        return `
            <div class="mp-card card mt-4">
                <div class="mp-header text-center">
                    ${mp.thumbnailUrl ? 
                        `<img src="${mp.thumbnailUrl}" alt="${mp.name}" class="mp-photo">` :
                        `<div class="mp-photo bg-white d-flex align-items-center justify-content-center">
                            <i class="fas fa-user fa-3x text-muted"></i>
                        </div>`
                    }
                    <h3 class="mp-name">${mp.name}</h3>
                    <span class="mp-party-badge ${partyClass}">${mp.party}</span>
                    <p class="mt-2 mb-0">${mp.constituency}</p>
                </div>
                
                <div class="mp-details">
                    ${mp.email ? `
                        <div class="mp-detail-item">
                            <div class="mp-detail-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div>
                                <strong>Email</strong><br>
                                <a href="mailto:${mp.email}">${mp.email}</a>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${mp.phone ? `
                        <div class="mp-detail-item">
                            <div class="mp-detail-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div>
                                <strong>Phone</strong><br>
                                ${mp.phone}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${showContinueBtn ? `
                    <button class="btn btn-primary w-100 mt-3" data-action="continue-to-compose">
                        Continue to Write Message
                        <i class="fas fa-arrow-right ms-2"></i>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    // Email composer screen
    emailComposerScreen(userData) {
        return `
            <div class="email-composer">
                <div class="composer-header">
                    <div>
                        <h3>Compose Your Message</h3>
                        <p class="text-muted mb-0">Writing to ${userData.mp.name} (${userData.constituency})</p>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h5>What would you like to discuss?</h5>
                    <div class="topic-selector">
                        <div class="topic-card" data-action="select-topic" data-topic="Cost of Living">
                            <i class="fas fa-pound-sign mb-2"></i>
                            <h6>Cost of Living</h6>
                        </div>
                        <div class="topic-card" data-action="select-topic" data-topic="Healthcare">
                            <i class="fas fa-hospital mb-2"></i>
                            <h6>Healthcare</h6>
                        </div>
                        <div class="topic-card" data-action="select-topic" data-topic="Education">
                            <i class="fas fa-graduation-cap mb-2"></i>
                            <h6>Education</h6>
                        </div>
                        <div class="topic-card" data-action="select-topic" data-topic="Environment">
                            <i class="fas fa-leaf mb-2"></i>
                            <h6>Environment</h6>
                        </div>
                        <div class="topic-card" data-action="select-topic" data-topic="Housing">
                            <i class="fas fa-home mb-2"></i>
                            <h6>Housing</h6>
                        </div>
                        <div class="topic-card" data-action="select-topic" data-topic="Other">
                            <i class="fas fa-ellipsis-h mb-2"></i>
                            <h6>Other Issue</h6>
                        </div>
                    </div>
                </div>
                
                <div class="personal-details mb-4">
                    <h5>Your Details</h5>
                    <p class="text-muted">This information will be included in your email</p>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="user-full-name" class="form-label">Full Name *</label>
                            <input
                                type="text"
                                class="form-control"
                                id="user-full-name"
                                placeholder="Enter your full name"
                                required
                            >
                        </div>
                        <div class="col-md-6">
                            <label for="user-address" class="form-label">Address</label>
                            <input
                                type="text"
                                class="form-control"
                                id="user-address"
                                value="${userData.address || ''}"
                                readonly
                                placeholder="Address from previous step"
                            >
                        </div>
                    </div>
                </div>

                <div class="reference-input">
                    <h5>Reference Material (Optional)</h5>
                    <p class="text-muted">Add a link to an article or reference to support your message</p>
                    <input
                        type="url"
                        class="form-control"
                        id="reference-link"
                        placeholder="https://example.com/article"
                    >
                </div>
                
                <button 
                    class="btn btn-primary" 
                    id="generate-email-btn"
                    data-action="generate-email"
                    disabled
                >
                    <i class="fas fa-magic me-2"></i>
                    Generate Email with AI
                </button>
                
                <div id="email-preview-container" class="mt-4"></div>
                
                <button 
                    class="btn btn-success d-none" 
                    id="review-email-btn"
                    data-action="review-email"
                >
                    Review & Send
                    <i class="fas fa-arrow-right ms-2"></i>
                </button>
            </div>
        `;
    },
    
    // AI generating state
    aiGenerating() {
        return `
            <div class="email-preview ai-generating">
                <div class="spinner-border text-primary" role="status"></div>
                <span>AI is crafting your message...</span>
            </div>
        `;
    },
    
    // Email preview
    emailPreview(content) {
        // Convert markdown to HTML for display
        const htmlContent = this.markdownToHtml(content);

        return `
            <div class="email-preview">
                <h5 class="mb-3">Generated Email</h5>

                <!-- Preview Mode -->
                <div id="email-preview-display" class="email-content-display">
                    <div class="email-content-html">${htmlContent}</div>
                    <div class="mt-3">
                        <button class="btn btn-outline-secondary btn-sm" onclick="toggleEmailEdit()">
                            <i class="fas fa-edit me-1"></i>Edit Email
                        </button>
                    </div>
                </div>

                <!-- Edit Mode -->
                <div id="email-edit-mode" class="d-none">
                    <label class="form-label">Edit your email:</label>

                    <!-- Rich Text Editor -->
                    <div id="email-rich-editor" style="height: 400px; border: 1px solid #ddd; border-radius: 8px;">
                        <!-- Quill editor will be initialized here -->
                    </div>

                    <div class="mt-3 d-flex justify-content-between align-items-center">
                        <div>
                            <button class="btn btn-primary btn-sm me-2" onclick="saveRichTextEdit()">
                                <i class="fas fa-save me-1"></i>Save Changes
                            </button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="cancelRichTextEdit()">
                                <i class="fas fa-times me-1"></i>Cancel
                            </button>
                        </div>
                        <div>
                            <small class="text-muted">
                                <i class="fas fa-info-circle me-1"></i>
                                Use the toolbar above to format your text
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Convert basic markdown to HTML
    markdownToHtml(markdown) {
        return markdown
            // Bold text **text** -> <strong>text</strong>
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic text *text* -> <em>text</em>
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Headers ### text -> <h3>text</h3>
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            // Wrap in paragraphs
            .replace(/^(.)/gm, '<p>$1')
            .replace(/(.)$/gm, '$1</p>')
            // Clean up multiple paragraph tags
            .replace(/<\/p><p>/g, '</p>\n<p>')
            // Lists (basic support)
            .replace(/^\d+\.\s+(.*$)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')
            // Clean up any double paragraph wrapping
            .replace(/<p><h([1-6])>/g, '<h$1>')
            .replace(/<\/h([1-6])><\/p>/g, '</h$1>');
    },
    
    // Review screen
    reviewScreen(userData) {
        return `
            <div class="review-container">
                <h2 class="text-center mb-4">Review Your Message</h2>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <strong>To:</strong> ${userData.mp.name} (${userData.mp.email})
                    </div>
                    <div class="card-body">
                        <div class="email-content">${this.markdownToHtml(userData.emailContent)}</div>
                    </div>
                </div>
                
                <div class="d-flex gap-3 justify-content-center">
                    <button class="btn btn-outline-primary" data-action="copy-email">
                        <i class="fas fa-copy me-2"></i>
                        Copy to Clipboard
                    </button>
                    
                    <button class="btn btn-primary" data-action="send-email">
                        <i class="fas fa-envelope me-2"></i>
                        Open in Email Client
                    </button>
                </div>
                
                <div class="text-center mt-4">
                    <button class="btn btn-link" data-action="start-over">
                        Start a New Message
                    </button>
                </div>
            </div>
        `;
    },
    
    // Utility function to escape HTML
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}; 