# DearPower TODO List

## Phase 1: Project Structure & Setup
- [x] Create memory-bank.md
- [x] Create todo.md
- [x] Create folder structure (/css, /js, /components)
- [x] Set up index.html with clean structure
- [x] Create CSS files (main.css, components.css, utilities.css)
- [x] Create JS modules (app.js, api.js, components.js, mapbox.js, openai.js)

## Phase 2: Welcome/Explanation Screen
- [x] Design welcome screen with clear explanation
- [x] Create step indicator component
- [x] Add "Get Started" button
- [x] Implement smooth transitions between steps

## Phase 3: Address Lookup Integration
- [x] Implement Mapbox Address Autofill
- [x] Create address search component
- [x] Add map preview showing selected location
- [x] Handle address selection and validation
- [x] Extract constituency from address

## Phase 4: MP Display
- [x] Fetch MP data from Parliament API
- [x] Create MP card component
- [x] Display MP photo, name, party, contact info
- [x] Add constituency information
- [ ] Show voting record (if available)

## Phase 5: Email Generation with AI
- [x] Set up OpenAI API integration
- [x] Create email composition interface
- [x] Add topic/issue selection
- [x] Implement reference/article link input
- [x] Generate email with GPT-4 Mini (template fallback)
- [x] Allow editing of generated email

## Phase 6: Final Review & Send
- [x] Create review screen
- [x] Add copy-to-clipboard functionality
- [x] Implement email client integration
- [ ] Add success confirmation
- [x] Option to start new message

## Technical Improvements
- [ ] Add proper error handling
- [ ] Implement loading states
- [ ] Add form validation
- [ ] Set up local storage for drafts
- [ ] Add analytics (privacy-respecting)

## UI/UX Enhancements
- [ ] Responsive design for mobile
- [ ] Accessibility improvements (ARIA labels, keyboard nav)
- [ ] Dark mode support
- [ ] Smooth animations and transitions
- [ ] Progress saving

## Future Features
- [ ] Save message history
- [ ] Track responses from MPs
- [ ] Template library
- [ ] Multi-language support
- [ ] Share campaigns

## Next Steps
1. Test the application with real addresses
2. Add OpenAI API key configuration
3. Improve error handling and edge cases
4. Add mobile responsiveness
5. Deploy to hosting service 