# DearPower

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" alt="Status: In Development">
  <img src="https://img.shields.io/badge/Platform-Web-blue" alt="Platform: Web">
  <img src="https://img.shields.io/badge/UK%20Focus-Parliament-red" alt="UK Focus: Parliament">
</p>

## 📣 Empowering UK Citizens to Be Heard

DearPower is a web platform designed to bridge the gap between UK citizens and those in positions of power and influence. It simplifies and streamlines the process of contacting MPs, journalists, editors, and ombudsmen, making it easier for citizens to raise concerns, report problems, and demand accountability.

## 🎯 Purpose

In a functioning democracy, citizens should have easy access to their representatives and those who shape public discourse. DearPower removes barriers by:

- Providing a user-friendly interface to quickly find and contact the right person
- Streamlining the message creation process with helpful templates and guidelines
- Making it easier to track and follow up on communications
- Creating transparency around common issues being reported

## ✨ Features

### Current Features

- **MP Contact System**: 
  - Postcode-based MP lookup using official UK Parliament data.
  - Comprehensive MP profiles with contact details (Parliamentary & Constituency offices, social media) and time as MP.
  - Integrated postcode validation (via Postcodes.io) before MP lookup.
  - Address lookup functionality using **Mapbox Address Autofill** to assist with form completion, including a minimap display.
  - Message composition with character counting and optional templates.
  - Uses `mailto:` links to open the user's default email client with the message pre-filled.

### How it Works: Message Sending

DearPower facilitates contacting your MP by generating a `mailto:` link. Here's the process:

1.  **Find Your MP**: Use the postcode search to find your Member of Parliament.
2.  **Compose Message**: Draft your message using the provided form. You can include your details, subject, and the message body.
3.  **Preview**: Review your message in a preview modal.
4.  **Open in Email Client**: Clicking "Open in Email Client" constructs a `mailto:` link. This link includes:
    *   The MP's email address.
    *   A CC to your email address (if you select the "Send me a copy" option).
    *   The subject you entered.
    *   The body of your message.
5.  **User's Email Client**: Your web browser will then attempt to open your device's default email client (e.g., Outlook, Apple Mail, Thunderbird) with all these details pre-filled.
6.  **Send Manually**: You will need to review the email in your client and click the "Send" button within your email application to actually dispatch the message.

#### Limitations of `mailto:`

Using `mailto:` links has some inherent limitations:

*   **Configured Email Client Required**: The user must have a default email client configured on their device. If not, the link may not work, or the browser might show an error.
*   **Message Length Limits**: Very long messages might be truncated or cause issues, as different email clients and operating systems have varying limits on the length of `mailto:` links (especially the body). The application recommends keeping messages under 2000 characters.
*   **No Sending Confirmation**: DearPower cannot confirm if the email was actually sent. Once the email client is opened, the sending process is outside the control of the web application.
*   **No Direct Sending**: Emails are not sent directly from the DearPower platform. All sending is handled by the user's own email client.

### Upcoming Features

- **Multi-Channel Outreach**: 
  - Contact journalists, newspaper editors, and media organizations
  - Reach out to ombudsmen and regulatory bodies
  - Connect with local councilors and regional representatives

- **Campaign Tools**:
  - Create and share template messages for specific issues
  - Track campaign effectiveness
  - Collaborate with others on important topics

- **Response Tracking**:
  - Log responses from officials
  - Set reminders for follow-ups
  - Share outcomes with other users

## 🔧 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome 6
- **APIs**:
  - UK Parliament Members API (for MP data).
  - Postcodes.io (for postcode validation).
  - **Mapbox Address Autofill & Geocoding API** (for address input assistance and minimap display).
  - OS Places API (available for alternative address lookup integration, currently disabled by default).

## API Key Management

This project utilizes APIs that may require API keys for full functionality:

-   **Mapbox API**: Used for address autocompletion and displaying interactive maps.
-   **OS Places API**: (Currently disabled but available for re-integration) Can be used as an alternative for address lookup.

### Security Risks of Client-Side API Keys

Embedding API keys directly in client-side JavaScript (as is currently done for demonstration purposes with the Mapbox token) poses significant security risks:

-   **Exposure**: Keys can be easily found by inspecting the browser's source code.
-   **Misuse & Theft**: Exposed keys can be stolen and used by malicious actors, potentially leading to:
    -   Unauthorized use of your API quotas.
    -   Unexpected costs if the key is tied to a paid account.
    -   Service disruption if rate limits are exceeded due to unauthorized use.

### Recommended Best Practice: Backend Proxy

For any production or publicly deployed environment, it is **strongly recommended** to manage and use API keys via a backend proxy server.

-   **How it works**:
    1.  Your client-side application makes a request to your own backend server.
    2.  Your backend server receives this request, attaches the secure API key (stored only on the server), and then forwards the request to the third-party API (e.g., Mapbox, OS Places).
    3.  The third-party API responds to your backend server.
    4.  Your backend server then relays the response back to the client-side application.
-   **Benefits**: This approach keeps your API keys completely hidden from the client browser, significantly enhancing security.

### Token Scoping and Restrictions (Mapbox Example)

For services like Mapbox that offer client-side public tokens, it is crucial to:

-   **Use Public Tokens**: These are distinct from secret keys and are intended for client-side use.
-   **Apply Scopes**: Configure the token with the narrowest possible permissions. For example, if you only need geocoding, the token should only have geocoding scopes enabled, not broader scopes like map tile serving or directions if they aren't used.
-   **URL Restrictions**: Restrict the token's usage to specific URLs where your project will be hosted. This prevents the token from being used on other websites even if it's discovered.

**Note on the current Mapbox Token**: The Mapbox token currently in `js/app.js` is provided for demonstration and local development purposes only. **It should be replaced with your own appropriately restricted Mapbox public token before deploying this project to any publicly accessible environment.**

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic web server for local development (or use a service like GitHub Pages for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/muazamsarfaraz/dearpower.git
   ```

2. Open the project folder:
   ```bash
   cd dearpower
   ```

3. To run locally, you can use any web server. For example, with Python:
   ```bash
   # Python 3
   python -m http.server
   ```

4. Open your browser and navigate to `http://localhost:8000`

### API Configuration

For full functionality, you will need to manage API keys as described in the "API Key Management" section. 
- **Mapbox Token**: Ensure the `MAPBOX_TOKEN` in `js/app.js` is replaced with your own restricted public token for deployment.
- **OS Places API (Optional Integration)**: If you choose to integrate the OS Places API:
    1.  Register for an API key at the [OS Data Hub](https://osdatahub.os.uk/).
    2.  Implement a backend proxy to securely use this key.
    3.  Update the client-side JavaScript to call your proxy endpoint.

## 📝 Usage

1. **Find Your Representative**:
   - Enter your UK postcode in the search bar at the top.
   - Click "Find MP". The system validates the postcode and fetches your MP's details.

2. **View MP Information**:
   - Your MP's photo, name, party, constituency, and time as MP are displayed.
   - Contact details for Parliamentary and Constituency offices (address, phone, email) are shown.
   - Links to their website and social media (Twitter/X, Facebook, etc.) are provided if available.
   - An illustrative voting record summary is shown with a link to their full voting record on the Parliament website.

3. **Compose Your Message**:
   - **Your Details**: Fill in your full name, email, and full address (the address lookup button can help populate this using your postcode and Mapbox Address Autofill).
   - **Message Details**:
     - Select an optional topic or click on topic badges to pre-fill the subject.
     - Write a clear and concise subject for your email.
     - Compose your message in the main text area (max 2000 characters).
     - Use the "Use template" button for a pre-structured message.
   - **Options**:
     - Check "Send me a copy of this message" to CC yourself.
     - You must check the privacy consent box.

4. **Preview and Send**:
   - Click "Preview Message" to see how your email will look.
   - Click "Open in Email Client". This will generate a `mailto:` link and attempt to open your default email application (e.g., Outlook, Apple Mail) with the MP's email, your CC, subject, and message body pre-filled.
   - **Important**: You must review the email in your email client and click its send button to actually dispatch the message. DearPower does not send the email directly.

## 🔍 Accessibility

DearPower is designed with accessibility in mind:

- High contrast mode for visually impaired users
- Keyboard navigation support
- Screen reader compatible content
- Responsive design for all device sizes

## 🤝 Contributing

We welcome contributions to DearPower! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Areas

We're particularly looking for help with:

- Frontend enhancements and accessibility improvements
- Additional API integrations for contacting journalists and ombudsmen
- User testing and feedback
- Documentation and tutorials

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [UK Parliament API](https://members-api.parliament.uk/) for MP data
- [Postcodes.io](https://postcodes.io/) for postcode validation
- [Ordnance Survey](https://osdatahub.os.uk/) for address lookup services
- [Bootstrap](https://getbootstrap.com/) for UI components
- [Font Awesome](https://fontawesome.com/) for icons

## 📞 Contact

For questions, feedback, or support:

- Create an issue on GitHub
- Contact the maintainers at [your-email@example.com]

---

<p align="center">
  <i>Empowering UK citizens to speak truth to power</i>
</p> 