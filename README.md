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
  - Postcode-based MP lookup using official UK Parliament data
  - Comprehensive MP profiles with contact details and office information
  - Integrated postcode validation and autocompletion
  - Address lookup functionality for easy form completion
  - Message composition with templates and character counting

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
  - UK Parliament Members API
  - Postcodes.io for postcode validation/autocomplete
  - OS Places API for address lookup (configurable)

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

For full functionality:

1. **For OS Places API integration (address lookup)**:
   - Register for an API key at the [OS Data Hub](https://osdatahub.os.uk/)
   - Replace `YOUR_OS_PLACES_API_KEY` in the code with your actual API key
   - Uncomment the relevant production code in the `getAddressesFromPostcode` function

## 📝 Usage

1. **Find Your Representative**:
   - Enter your postcode in the search bar
   - The system will automatically validate your postcode and find your MP

2. **View Contact Information**:
   - See comprehensive details about your MP
   - Find their office addresses, phone numbers, and email

3. **Compose Your Message**:
   - Use the guided form to create your message
   - Optional templates are available for common issues
   - Character counting helps ensure appropriate message length

4. **Review and Send**:
   - Preview your message before sending
   - Receive confirmation when your message is delivered

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