document.addEventListener('DOMContentLoaded', function() {
  const MEMBERS_API_BASE = 'https://members-api.parliament.uk/api';
  const POSTCODES_API_BASE = 'https://api.postcodes.io';
  const MAPBOX_TOKEN = 'pk.eyJ1IjoibXVhemFtc2FyZmFyYXoiLCJhIjoiY205b2dzdnVlMTVuZDJqczcwbnBseW1tYiJ9.-MvfX63GtzUQceap1g6iJQ';

  // --- DOM Elements ---
  const postcodeInput = document.getElementById('postcodeInput');
  const findBtn = document.getElementById('findBtn');
  const constituencyLabel = document.getElementById('constituencyLabel');
  const mpPlaceholder = document.getElementById('mpPlaceholder');

  // MP Card Elements
  const mpCard = document.getElementById('mpCard');
  const mpImg = document.getElementById('mpImg');
  const mpName = document.getElementById('mpName');
  const mpParty = document.getElementById('mpParty');
  const mpConstituency = document.getElementById('mpConstituency'); // Added element
  const mpSince = document.getElementById('mpSince');
  const mpEmail = document.getElementById('mpEmail'); // Hidden element for data
  const mpPhone = document.getElementById('mpPhone'); // Hidden element for data
  const mpContactDetails = document.getElementById('mpContactDetails');
  const votingRecordSection = document.getElementById('votingRecordSection'); // Added
  const mpLinksSection = document.getElementById('mpLinksSection'); // Added
  const votingLink = document.getElementById('votingLink');
  const websiteLink = document.getElementById('websiteLink');

  // Form Elements
  const draftForm = document.getElementById('draftForm');
  const mpWarning = document.getElementById('mpWarning');
  const fullNameInput = document.getElementById('fullName');
  const userEmailInput = document.getElementById('userEmail');
  const userAddressInput = document.getElementById('userAddress');
  const topicSelect = document.getElementById('topicSelect');
  const topicBadges = document.getElementById('topicBadges'); // Added
  const emailSubjectInput = document.getElementById('emailSubject');
  const emailBodyTextarea = document.getElementById('emailBody');
  const charCountSpan = document.getElementById('charCount');
  const templateBtn = document.getElementById('templateBtn');
  const copyMeCheckbox = document.getElementById('copyMe');
  const privacyConsentCheckbox = document.getElementById('privacyConsent');
  const previewBtn = document.getElementById('previewBtn');
  const sendBtn = document.getElementById('sendBtn');

  // Progress Bar Elements
  const progressBar = document.getElementById('progressBar');
  const progressSteps = document.querySelectorAll('.progress-step');

  // Modal Elements
  const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
  const previewToSpan = document.getElementById('previewTo');
  const previewFromSpan = document.getElementById('previewFrom');
  const previewSubjectSpan = document.getElementById('previewSubject');
  const previewBodyDiv = document.getElementById('previewBody');
  const previewSignatureDiv = document.getElementById('previewSignature');
  const previewSendBtn = document.getElementById('previewSendBtn');

  const privacyModal = new bootstrap.Modal(document.getElementById('privacyModal')); // Initialized modal
  const successModal = new bootstrap.Modal(document.getElementById('successModal')); // Initialized modal
  const writeAnotherBtn = document.getElementById('writeAnotherBtn'); // Added
  const shareFeedbackBtn = document.getElementById('shareFeedbackBtn'); // Added

  // Settings Dropdown Elements
  const contrastBtn = document.getElementById('contrastBtn');
  const fontSizeBtn = document.getElementById('fontSizeBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Other Elements
  const loadingOverlay = document.getElementById('loadingOverlay');
  const toastContainer = document.querySelector('.toast-container');
  const addressTooltipTrigger = document.querySelector('.address-tooltip'); // Added tooltip trigger

  // --- State Variables ---
  let currentMP = null;
  let currentStep = 1;
  const maxCharCount = 2000; // Defined max characters

  // Add after the declaration of other DOM elements in the JavaScript section
  const postcodeSuggestions = document.getElementById('postcodeSuggestions');
  const postcodeError = document.getElementById('postcodeError');
  const addressLookupContainer = document.getElementById('addressLookupContainer');
  const addressAutofillContainer = document.getElementById('address-autofill-container');
  const minimapContainer = document.getElementById('minimap-container');
  const addressLookupStatus = document.getElementById('addressLookupStatus');
  const findAddressBtn = document.getElementById('findAddressBtn');

  // --- Helper Functions ---

  // Show/Hide Loading
  function showLoadingOverlay() {
    loadingOverlay.classList.remove('d-none');
    loadingOverlay.setAttribute('aria-busy', 'true');
  }
  function hideLoadingOverlay() {
    loadingOverlay.classList.add('d-none');
    loadingOverlay.setAttribute('aria-busy', 'false');
  }

  // Show Toast Notifications
  function showToast(message, type = 'info') {
      const toastHtml = `
          <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="d-flex">
                  <div class="toast-body">
                      ${message}
                  </div>
                  <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
          </div>
      `;
      const toastElement = document.createElement('div');
      toastElement.innerHTML = toastHtml;
      toastContainer.appendChild(toastElement.firstElementChild);
      const toast = new bootstrap.Toast(toastContainer.lastElementChild);
      toast.show();
  }

  // Update Progress Bar and Steps
  function updateProgress(step) {
      currentStep = step;
      const progress = (step - 1) * 50; // 0% for step 1, 50% for step 2, 100% for step 3
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
      }

      progressSteps.forEach(stepEl => {
          const stepNumber = parseInt(stepEl.dataset.step);
          stepEl.classList.remove('active', 'completed');
          if (stepNumber === step) {
              stepEl.classList.add('active');
          } else if (stepNumber < step) {
              stepEl.classList.add('completed');
          }
      });
  }

    // Update Send Button State
    function updateSendButtonState() {
        const isFormValid = draftForm.checkValidity();
        sendBtn.disabled = !currentMP || !isFormValid;
        previewBtn.disabled = !currentMP || !isFormValid; // Also disable preview if form invalid
    }

  // Reset Form and MP State
  function resetForm() {
    draftForm.reset();
    showMPCard(false);
    currentMP = null;
    constituencyLabel.textContent = '';
    postcodeInput.value = '';
    mpContactDetails.innerHTML = '';
    if (votingRecordSection) votingRecordSection.classList.add('d-none');
    if (mpLinksSection) mpLinksSection.classList.add('d-none');
    updateProgress(1);
    updateSendButtonState();
    updateCharCount(); // Reset character count
    if (mpWarning) mpWarning.classList.remove('d-none'); // Show warning again
    document.body.classList.remove('larger-text'); // Reset font size if toggled
  }

  // Show/Hide MP Card & Placeholder
  function showMPCard(show) {
    if (mpCard) mpCard.classList.toggle('d-none', !show);
    if (mpPlaceholder) mpPlaceholder.classList.toggle('d-none', show);
    if (mpWarning) mpWarning.classList.toggle('d-none', show); // Hide warning when MP card is shown
    updateSendButtonState(); // Update button state when MP card visibility changes
  }

  // Handle MP Lookup
  async function findMP(postcode) {
    if (!postcode || !postcode.trim()) {
      constituencyLabel.textContent = 'Please enter a postcode.';
      showMPCard(false); // Ensure placeholder is shown
      return;
    }

    showLoadingOverlay();
    constituencyLabel.textContent = 'Looking up MP...';
    showMPCard(false); // Hide existing card and show placeholder immediately

    try {
      // 1. Find Constituency and Member ID
      const searchRes = await fetch(`${MEMBERS_API_BASE}/Members/Search?Location=${encodeURIComponent(postcode)}&House=1&IsEligible=true&IsCurrentMember=true&skip=0&take=1`);
      if (!searchRes.ok) {
           throw new Error(`Parliament API error! status: ${searchRes.status}`);
      }
      const searchData = await searchRes.json();

      if (!searchData || !searchData.items || !searchData.items.length) {
        constituencyLabel.textContent = `No current MP found for postcode: ${postcode.trim().toUpperCase()}. Please double-check.`;
        // mpImg.alt will be set by showMPCard(false) if that's called or should be set explicitly
        if(mpImg) mpImg.alt = "Placeholder image for MP";
        hideLoadingOverlay();
        showToast(`No MP found for ${postcode.trim().toUpperCase()}. Please check the postcode.`, 'warning');
        return;
      }
      const mp = searchData.items[0].value;
      currentMP = mp; // Store current MP data

      // 2. Fetch Contact Info
      const contactRes = await fetch(`${MEMBERS_API_BASE}/Members/${mp.id}/Contact`);
       if (!contactRes.ok) {
           // Log the error but attempt to continue displaying MP info found so far
           console.error(`Error fetching contact info! status: ${contactRes.status}`);
           showToast('Could not fetch all contact details for the MP.', 'warning');
           // Set contacts to empty array to avoid breaking downstream code
           var contacts = []; 
       } else {
           const contactData = await contactRes.json();
           var contacts = Array.isArray(contactData.value) ? contactData.value : [];
           console.log('MP Contact Info:', contacts);
       }


      // 3. Display MP Info & Contacts
      if (mpName) mpName.textContent = mp.nameDisplayAs || 'Your MP';

      if (mpParty) {
        mpParty.textContent = mp.latestParty?.name || 'Unknown Party';
        const partyClass = mp.latestParty?.abbreviation ? 'party-' + mp.latestParty.abbreviation.toLowerCase() : 'party-other';
        mpParty.className = `badge mb-2 ${partyClass}`; // Update class
      }

      if (mpConstituency && mp.latestHouseMembership?.membershipFrom) {
        mpConstituency.textContent = mp.latestHouseMembership.membershipFrom;
        constituencyLabel.textContent = `Constituency: ${mp.latestHouseMembership.membershipFrom}`; // Display constituency in header
      } else if (mpConstituency) {
         mpConstituency.textContent = '';
         constituencyLabel.textContent = ''; // Clear header label if no constituency found
      }

      if (mpSince && mp.latestHouseMembership?.membershipStartDate) {
        mpSince.textContent = `MP since ${mp.latestHouseMembership.membershipStartDate.slice(0,4)}`;
      } else if (mpSince) {
        mpSince.textContent = '';
      }

      if (mpImg) {
        mpImg.src = mp.thumbnailUrl || 'https://www.parliament.uk/static-image-placeholder.jpg';
        mpImg.alt = mp.thumbnailUrl ? `Photo of ${mp.nameDisplayAs || 'MP'}` : 'Placeholder image for MP';
      }

      // Build Contact Details HTML dynamically
      let contactHtml = '';
      constituencyLabel.textContent += ` (${mp.nameDisplayAs || 'Your MP'})`; // Add MP name to header label

      // Filter and group contacts by type
      const parliamentaryOffice = contacts.find(c => c.type === 'Parliamentary office');
      const constituencyOffice = contacts.find(c => c.type === 'Constituency office');
      const webContacts = contacts.filter(c => ['Website', 'X (formerly Twitter)', 'Facebook', 'Instagram'].includes(c.type));

      // Add Parliamentary Office
      if (parliamentaryOffice && (parliamentaryOffice.line1 || parliamentaryOffice.phone || parliamentaryOffice.email)) {
         contactHtml += `<div class="contact-section">
             <div class="contact-item">
               <div class="icon-text">
                 <i class="fa-solid fa-building text-primary"></i>
                 <h6>Parliamentary Office</h6>
               </div>
             </div>`;
         if (parliamentaryOffice.line1) contactHtml += `<div class="contact-item">
             <div class="icon-text">
               <i class="fa-solid fa-location-dot"></i>
               <span>${[parliamentaryOffice.line1, parliamentaryOffice.line2, parliamentaryOffice.line3, parliamentaryOffice.line4, parliamentaryOffice.line5, parliamentaryOffice.postcode].filter(Boolean).join(', ')}</span>
             </div>
           </div>`;
         if (parliamentaryOffice.phone) contactHtml += `<div class="contact-item">
             <div class="icon-text">
               <i class="fa-solid fa-phone"></i>
               <a href="tel:${parliamentaryOffice.phone.replace(/\s/g,'')}">${parliamentaryOffice.phone}</a>
             </div>
           </div>`;
         if (parliamentaryOffice.email) {
             mpEmail.textContent = parliamentaryOffice.email; // Store email for mailto later
             contactHtml += `<div class="contact-item">
               <div class="icon-text">
                 <i class="fa-solid fa-envelope"></i>
                 <a href="mailto:${parliamentaryOffice.email}">${parliamentaryOffice.email}</a>
               </div>
             </div>`;
         }
         contactHtml += `</div>`;
      } else {
          // Fallback if no specific office listed but a general MP email is available
           const generalEmail = contacts.find(c => c.type === 'Email')?.line1;
           if(generalEmail) {
                mpEmail.textContent = generalEmail; // Store general email
                contactHtml += `<div class="contact-section">
                    <div class="contact-item">
                      <div class="icon-text">
                        <i class="fa-solid fa-envelope text-primary"></i>
                        <h6>Primary Contact Email</h6>
                      </div>
                    </div>
                    <div class="contact-item">
                      <div class="icon-text">
                        <i class="fa-solid fa-envelope"></i>
                        <a href="mailto:${generalEmail}">${generalEmail}</a>
                      </div>
                    </div>
                    </div>`;
           }
      }

      // Add Constituency Office
      if (constituencyOffice && (constituencyOffice.line1 || constituencyOffice.phone || constituencyOffice.email)) {
         contactHtml += `<div class="contact-section">
             <div class="contact-item">
               <div class="icon-text">
                 <i class="fa-solid fa-map-marker-alt text-success"></i>
                 <h6>Constituency Office</h6>
               </div>
             </div>`;
         if (constituencyOffice.line1) contactHtml += `<div class="contact-item">
             <div class="icon-text">
               <i class="fa-solid fa-location-dot"></i>
               <span>${[constituencyOffice.line1, constituencyOffice.line2, constituencyOffice.line3, constituencyOffice.line4, constituencyOffice.line5, constituencyOffice.postcode].filter(Boolean).join(', ')}</span>
             </div>
           </div>`;
         if (constituencyOffice.phone) contactHtml += `<div class="contact-item">
             <div class="icon-text">
               <i class="fa-solid fa-phone"></i>
               <a href="tel:${constituencyOffice.phone.replace(/\s/g,'')}">${constituencyOffice.phone}</a>
             </div>
           </div>`;
         if (constituencyOffice.email) contactHtml += `<div class="contact-item">
             <div class="icon-text">
               <i class="fa-solid fa-envelope"></i>
               <a href="mailto:${constituencyOffice.email}">${constituencyOffice.email}</a>
             </div>
           </div>`;
         contactHtml += `</div>`;
      }

      // Add Social/Web Links section if any exist
      if (webContacts.length > 0) {
          let socialHtml = `<div class="social-links">`;
          webContacts.forEach(contact => {
              let icon = 'fa-globe'; // Default icon
              let text = contact.type;
              if (contact.type === 'X (formerly Twitter)') { icon = 'fa-x-twitter'; text = 'Twitter/X'; }
              else if (contact.type === 'Facebook') { icon = 'fa-facebook-f'; } // Using -f for solid icon
              else if (contact.type === 'Instagram') { icon = 'fa-instagram'; }

              // Ensure URL has a protocol
              let url = contact.line1;
               if (url && !/^[a-zA-Z]+:\/\//i.test(url)) {
                   url = 'http://' + url;
               }

              if (url) {
                 socialHtml += `<a href="${url}" target="_blank" rel="noopener noreferrer"><i class="fab ${icon}"></i>${text}</a>`;
              }
          });
          socialHtml += `</div>`;
          contactHtml += socialHtml;
      }

      mpContactDetails.innerHTML = contactHtml;

      // Show voting record & links section (if they have data, currently static)
      if (votingRecordSection) votingRecordSection.classList.remove('d-none');
      if (mpLinksSection) mpLinksSection.classList.remove('d-none');


      if (votingLink && mp.id) {
        votingLink.href = `https://members.parliament.uk/member/${mp.id}/voting`;
      }

      // Set main website link (prefer explicit 'Website' type, otherwise parliament profile)
      const website = contacts.find(c => c.type === 'Website')?.line1;
      if (websiteLink) {
           // Ensure URL has a protocol
           let websiteUrl = website;
            if (websiteUrl && !/^[a-zA-Z]+:\/\//i.test(websiteUrl)) {
                websiteUrl = 'http://' + websiteUrl;
            }
           websiteLink.href = websiteUrl || (mp.id ? `https://members.parliament.uk/member/${mp.id}` : '#');
           websiteLink.classList.toggle('d-none', !websiteUrl && !mp.id); // Hide if no link available
      }


      showMPCard(true); // Show the populated card
      hideLoadingOverlay();
      updateProgress(2); // Move to Draft step
      showToast(`MP found: ${mp.nameDisplayAs || 'Your MP'}`, 'success');

    } catch (e) {
      console.error('Error finding MP:', e);
      constituencyLabel.textContent = `Error: Could not find MP for postcode. Please try again.`;
      hideLoadingOverlay();
      showMPCard(false); // Ensure placeholder is shown on error
      showToast('Error finding MP. Please try again.', 'danger');
    }
  }

  // Character Count for Textarea
  if (emailBodyTextarea) {
    emailBodyTextarea.addEventListener('input', updateCharCount);
    updateCharCount(); // Initial count
  }

  function updateCharCount() {
    if (!emailBodyTextarea || !charCountSpan) return;
    const count = emailBodyTextarea.value.length;
    charCountSpan.textContent = `${count} / ${maxCharCount}`;
    if (count > maxCharCount) {
      charCountSpan.classList.add('warning');
      emailBodyTextarea.classList.add('is-invalid'); // Optional: Add invalid state
    } else {
      charCountSpan.classList.remove('warning');
      emailBodyTextarea.classList.remove('is-invalid');
    }
    updateSendButtonState(); // Update state whenever text changes
  }

  // Topic Badge Click
    if(topicBadges) {
        // Event delegation for dynamically added elements or if they are buttons
        topicBadges.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' && e.target.classList.contains('topic-badge')) {
                const topicText = e.target.textContent.trim();
                // Simple logic: If subject is empty, add topic. Else, append.
                if (!emailSubjectInput.value.trim()) {
                    emailSubjectInput.value = topicText;
                } else if (!emailSubjectInput.value.includes(topicText)) {
                     emailSubjectInput.value += ` - ${topicText}`;
                }
                emailSubjectInput.focus(); // Focus subject field
                updateSendButtonState();
            }
        });
    }

  // Use Template Button (Placeholder)
  if (templateBtn) {
    templateBtn.addEventListener('click', () => {
        if (!currentMP) {
            showToast("Please find your MP first.", "info");
            return;
        }
        const mpLastName = currentMP.nameDisplayAs.split(' ').pop();
        const constituencyName = currentMP.latestHouseMembership?.membershipFrom || 'my constituency';

        const templateSubject = `Regarding [Your Topic] in ${constituencyName}`;
        const templateBody = `Dear Mr/Ms/Dr ${mpLastName},\n\n` +
                             `I am writing to you as a constituent in ${constituencyName} regarding [Your Topic].\n\n` +
                             `[Explain briefly why this issue is important to you. Share your personal story or experience if relevant. Be specific about the problem.]\n\n` +
                             `[State clearly what action you would like your MP to take. E.g., "I urge you to support the upcoming bill...", "Could you please ask a question in Parliament about...", "Would you be able to meet with me/a constituent group..."]\n\n` +
                             `Thank you for your time and consideration of this important matter.\n\n` +
                             `Yours sincerely,\n\n` +
                             `[Your Full Name]\n[Your Full Address & Postcode]`;

        emailSubjectInput.value = templateSubject;
        emailBodyTextarea.value = templateBody;
        updateCharCount(); // Update count after filling template
        updateSendButtonState();
        showToast("Template loaded into message body.", "info");
    });
  }

  // Form Validation (using Bootstrap's built-in validation)
  if (draftForm) {
      draftForm.addEventListener('input', updateSendButtonState); // Check validity on input
      privacyConsentCheckbox.addEventListener('change', updateSendButtonState); // Check validity when privacy consent changes

      // Prevent default form submission for now, handle via preview/send buttons
      draftForm.addEventListener('submit', function(event) {
          event.preventDefault();
          event.stopPropagation();

          if (!currentMP) {
             showToast("Please find your MP before sending.", "warning");
             if (mpWarning) mpWarning.classList.remove('d-none');
             return;
          }

          if (draftForm.checkValidity() === false || emailBodyTextarea.value.length > maxCharCount) {
              showToast("Please fill out all required fields and check message length.", "warning");
              draftForm.classList.add('was-validated'); // Show validation feedback
              return;
          }

          // If validation passes, proceed to Preview (or direct send if no preview)
          // This structure implies preview is required before sending.
          // If you want direct send, move the sending logic here.
          // As per HTML structure, we go to preview first.
          populatePreviewModal();
          previewModal.show();
      });
  }


  // Populate & Show Preview Modal
  if (previewBtn) {
      previewBtn.addEventListener('click', () => {
           if (!currentMP) {
              showToast("Please find your MP first.", "info");
              return;
           }
           if (draftForm.checkValidity() === false || emailBodyTextarea.value.length > maxCharCount) {
              showToast("Please fill out all required fields and check message length.", "warning");
              draftForm.classList.add('was-validated');
              return;
          }
          populatePreviewModal();
          previewModal.show();
      });
  }

  function populatePreviewModal() {
      if (!currentMP || !previewToSpan || !previewFromSpan || !previewSubjectSpan || !previewBodyDiv || !previewSignatureDiv) return;

      const mpEmailAddress = mpEmail.textContent.trim();
      const userName = fullNameInput.value.trim();
      const userEmail = userEmailInput.value.trim();
      const userAddress = userAddressInput.value.trim().replace(/\n/g, '<br>'); // Format address for display
      const subject = emailSubjectInput.value.trim();
      const body = emailBodyTextarea.value.trim().replace(/\n/g, '<br>'); // Format body for display

      previewToSpan.textContent = `${currentMP.nameDisplayAs || 'Your MP'} <${mpEmailAddress}>`;
      previewFromSpan.textContent = `${userName} <${userEmail}>`;
      previewSubjectSpan.textContent = subject;
      previewBodyDiv.innerHTML = body;
      previewSignatureDiv.innerHTML = `${userName}<br>${userAddress}`; // Signature includes name and address

      // Enable send button in modal
      previewSendBtn.disabled = !mpEmailAddress || !userName || !userEmail || !subject || !body;
  }


  // Send Message Button (Modal)
  if (previewSendBtn) {
      previewSendBtn.addEventListener('click', () => {
          // In a real application, you would send this data to your backend
          // which would then send the email. Using mailto: is not reliable
          // for sensitive data or message length. This is a placeholder.

          if (!currentMP || !mpEmail.textContent.trim()) {
              showToast("Error: MP email not found.", "danger");
              previewModal.hide();
              return;
          }

          const mpEmailAddress = mpEmail.textContent.trim();
          const userName = fullNameInput.value.trim();
          const userEmail = userEmailInput.value.trim(); // Included in 'From' via backend ideally
          const userAddress = userAddressInput.value.trim();
          const subject = emailSubjectInput.value.trim();
          const body = emailBodyTextarea.value.trim();
          const copyMe = copyMeCheckbox.checked;

          // Prepare data to send to backend
          const messageData = {
              mpId: currentMP.id,
              mpEmail: mpEmailAddress,
              fullName: userName,
              email: userEmail,
              address: userAddress,
              subject: subject,
              body: body,
              sendCopy: copyMe
          };

          showLoadingOverlay(); // Show loading while sending (simulated)
          previewSendBtn.disabled = true; // Prevent double-click

          // --- Construct mailto link ---
          let mailtoLink = `mailto:${mpEmailAddress}`;
          const params = new URLSearchParams();
          if (copyMeCheckbox.checked && userEmail) {
              params.append('cc', userEmail);
          }
          params.append('subject', subject);
          params.append('body', body); // Body should be URI encoded by URLSearchParams

          mailtoLink += `?${params.toString()}`;

          hideLoadingOverlay();
          previewModal.hide();

          // Open mailto link
          window.location.href = mailtoLink;

          showToast("Your email client should now open to send the message.", "info");
          updateProgress(3); // Move to Review/Sent step
          previewSendBtn.disabled = false; // Re-enable button
      });
  }

    // Success Modal Buttons
    if (writeAnotherBtn) {
        writeAnotherBtn.addEventListener('click', () => {
            resetForm(); // Reset the form for a new message
            successModal.hide();
        });
    }
    if (shareFeedbackBtn) {
        shareFeedbackBtn.addEventListener('click', () => {
            // Placeholder for feedback link/modal
            alert("Share Feedback button clicked!"); // Replace with actual feedback mechanism
            successModal.hide();
        });
    }


  // --- Settings Dropdown ---

  // High Contrast Mode
  if (contrastBtn) {
      contrastBtn.addEventListener('click', () => {
          document.body.classList.toggle('contrast');
          // Persist setting in localStorage
          if (document.body.classList.contains('contrast')) {
              localStorage.setItem('contrastMode', 'enabled');
          } else {
              localStorage.removeItem('contrastMode');
          }
      });
      // Apply contrast mode on load if saved
      if (localStorage.getItem('contrastMode') === 'enabled') {
          document.body.classList.add('contrast');
      }
  }

  // Larger Text
  if (fontSizeBtn) {
      fontSizeBtn.addEventListener('click', () => {
          document.body.classList.toggle('larger-text');
          // You would define styles for `.larger-text` in your CSS
          // e.g., body.larger-text { font-size: 1.1rem; }
          // Then adjust other font sizes relative to this.
           // Persist setting in localStorage (Optional)
          if (document.body.classList.contains('larger-text')) {
              localStorage.setItem('largerText', 'enabled');
          } else {
              localStorage.removeItem('largerText');
          }
      });
       // Apply larger text on load if saved
      if (localStorage.getItem('largerText') === 'enabled') {
          document.body.classList.add('larger-text');
      }
  }

  // Reset Form
  if (resetBtn) {
      resetBtn.addEventListener('click', resetForm);
  }


    // --- Tooltips Initialization ---
    // Initialize all tooltips on the page
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // --- Initial State Setup ---
    showMPCard(false); // Start with placeholder visible
    if (mpImg) mpImg.alt = "Placeholder image for MP"; // Initial alt text
    updateProgress(1); // Start at step 1
    updateSendButtonState(); // Disable send button initially

  // Validate postcode before search
  if (findBtn) {
    findBtn.addEventListener('click', () => {
      const postcode = postcodeInput.value.trim();
      validateAndFindMP(postcode);
    });
  }

  if (postcodeInput) {
    postcodeInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const postcode = postcodeInput.value.trim();
        validateAndFindMP(postcode);
      }
    });
  }

  // Function to validate postcode and then find MP
  async function validateAndFindMP(postcode) {
    if (!postcode) {
      constituencyLabel.textContent = 'Please enter a postcode.';
      return;
    }
    
    // Show loading state
    showLoadingOverlay();
    constituencyLabel.textContent = 'Validating postcode...';
    
    try {
      // First validate the postcode with postcodes.io
      const validateUrl = `${POSTCODES_API_BASE}/postcodes/${encodeURIComponent(postcode)}/validate`;
      const validateResponse = await fetch(validateUrl);
      // No explicit !validateResponse.ok check here, relies on status in JSON
      const validateData = await validateResponse.json();
      
      if (validateData.status === 200 && validateData.result) {
        // Valid postcode, proceed to find MP
        constituencyLabel.textContent = 'Looking up MP...';
        findMP(postcode); // findMP has its own error handling
      } else {
        // Invalid postcode
        hideLoadingOverlay();
        constituencyLabel.textContent = '';
        postcodeError.textContent = 'Please enter a valid UK postcode.';
        postcodeError.className = 'd-block mt-1 text-warning fw-medium';
        if(mpImg) mpImg.alt = "Placeholder image for MP";
        showMPCard(false);
      }
    } catch (error) { // Catches network errors for validateUrl fetch or errors from findMP if not caught there
      console.error('Error in postcode validation or MP lookup process:', error);
      hideLoadingOverlay();
      constituencyLabel.textContent = '';
      postcodeError.textContent = 'Error processing postcode or finding MP. Please try again.';
      if(mpImg) mpImg.alt = "Placeholder image for MP";
      showMPCard(false);
      showToast('An error occurred. Please try again.', 'danger');
    }
  }

  // Initialize Mapbox Address Autofill. This is the primary address lookup mechanism.
  if (findAddressBtn && addressAutofillContainer) {
    let autofill; // MapboxAddressAutofill instance
    let minimap;  // MapboxAddressMinimap instance

    findAddressBtn.addEventListener('click', function() {
      const postcodeForAutofill = postcodeInput.value.trim();
      if (!postcodeForAutofill) {
        showToast('Please enter your postcode in the main search bar first.', 'warning');
        postcodeInput.focus();
        return;
      }
      addressLookupContainer.classList.remove('d-none'); // Show the container for autofill and map
      
      if (!autofill) { // Initialize only once
        autofill = new MapboxAddressAutofill({
          accessToken: MAPBOX_TOKEN,
          theme: {
            variables: {
              fontFamily: 'Inter, sans-serif',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              width: '100%'
            }
          }
        });

        minimap = new MapboxAddressMinimap({
          accessToken: MAPBOX_TOKEN,
          canAdjustMarker: true,
          satelliteToggle: true,
        });

        autofill.addEventListener('retrieve', (e) => {
          const retrievedFeature = e.detail.features[0];
          if (retrievedFeature) {
            minimap.feature = retrievedFeature;
            minimap.show(); // Show the minimap
            minimapContainer.classList.remove('d-none'); // Ensure container is visible
            formatAddressFromFeature(retrievedFeature); // Populate the textarea
            addressLookupStatus.textContent = 'Address selected. You can manually adjust if needed.';
            addressLookupStatus.className = 'form-text mt-1 text-success';
          } else {
            addressLookupStatus.textContent = 'Address not fully retrieved. Please try again or enter manually.';
            addressLookupStatus.className = 'form-text mt-1 text-warning';
          }
        });
        
        // Render the Mapbox Autofill component into its container
        // This will create an input field inside 'address-autofill-container'
        autofill.render({ container: addressAutofillContainer });
        // Render the minimap into its container, initially hidden until an address is selected
        minimap.render({ container: minimapContainer });
        minimap.hide(); // Start hidden
        minimapContainer.classList.add('d-none'); // Ensure container is hidden
      }
      
      // Set initial search value for the autofill component
      // This will trigger the autofill suggestions.
      autofill.setValue(postcodeForAutofill); 
      addressLookupStatus.textContent = 'Start typing your address or select from suggestions.';
      addressLookupStatus.className = 'form-text mt-1 text-muted';
      // The Mapbox Autofill component has its own input, so focus that if possible,
      // though direct focus might be tricky as it's internally managed.
      // For now, prompting the user to type is sufficient.
    });

    // Improved address formatting function
    function formatAddressFromFeature(feature) {
      if (!feature || !feature.properties) {
        if (feature && feature.place_name) {
          const addressLinesFromName = feature.place_name.split(',')
            .map(line => line.trim())
            .filter(line => line.toLowerCase() !== 'united kingdom');
          userAddressInput.value = addressLinesFromName.join('\n');
        } else {
            userAddressInput.value = ''; // Clear if no info
        }
        return;
      }

      const props = feature.properties;
      const context = feature.context || {};
      const addressLines = [];

      // Prefer address_line1 if available, as it's often the most complete street address
      if (props.address_line1) {
        addressLines.push(props.address_line1.trim());
      } else if (props.address && props.street) { // Fallback for some structures
        addressLines.push(`${props.address} ${props.street}`.trim());
      } else if (props.address) { // If only number/name
        addressLines.push(props.address.trim());
      } else if (props.street) { // If only street
         addressLines.push(props.street.trim());
      }
      
      if (props.address_line2) { // Secondary line (e.g. apartment, building name if not in line1)
        addressLines.push(props.address_line2.trim());
      }

      const placeName = (context.place && context.place.name) || props.place_name || '';
      const localityName = (context.locality && context.locality.name) || props.locality || '';

      // Add city/town (place) - avoid duplicating if it's already in address_line2
      if (placeName && (!props.address_line2 || !props.address_line2.includes(placeName))) {
        addressLines.push(placeName.trim());
      }
      // Add locality if it's different from place and not already in address_line2
      if (localityName && localityName !== placeName && (!props.address_line2 || !props.address_line2.includes(localityName))) {
         addressLines.push(localityName.trim());
      }
      
      const postcode = (context.postcode && context.postcode.name) || props.postcode || '';
      if (postcode) {
        addressLines.push(postcode.trim().toUpperCase());
      }
      
      userAddressInput.value = addressLines.filter(line => line).join('\n');
    }
  }
  // Removed the other 'if (findAddressBtn && addressLookupContainer)' block and its functions:
  // showAddressForm, showSimpleAddressForm, setupAddressSearch, createAddressFormFromPostcode, showManualAddressForm
  // as they are superseded by the MapboxAddressAutofill component flow.
});
