# DearPower 🏛️

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-green" alt="Status: Production Ready">
  <img src="https://img.shields.io/badge/Platform-Web-blue" alt="Platform: Web">
  <img src="https://img.shields.io/badge/UK%20Focus-Parliament-red" alt="UK Focus: Parliament">
  <img src="https://img.shields.io/badge/AI-GPT--4.1--nano-purple" alt="AI: GPT-4.1-nano">
</p>

## 📣 Empowering UK Citizens with AI-Powered Parliamentary Communication

DearPower is a modern web application that empowers UK citizens to write personalized, professional emails to their Members of Parliament (MPs) using AI assistance and enhanced address selection. Built with cutting-edge technology, it bridges the gap between citizens and their representatives through intelligent automation and user-friendly design.

## ✨ Features

### 🎯 **Core Functionality**
- **Enhanced Address Selection**: Mapbox-powered geocoder with precise door-level address selection
- **MP Lookup**: Automatic MP identification based on exact address location
- **AI-Powered Email Generation**: Uses OpenAI's GPT-4.1-nano model for cost-effective, high-quality emails
- **Rich Text Editor**: WYSIWYG editor with formatting toolbar (bold, italic, headers, lists)
- **Topic Selection**: Choose from healthcare, education, environment, housing, cost of living, or custom issues
- **Article Integration**: Reference news articles or reports to strengthen your arguments

### 🎨 **User Experience**
- **Professional Interface**: Clean, modern design with intuitive navigation
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Validation**: Form validation and error handling throughout the flow
- **Progress Tracking**: Clear step-by-step progress indicator
- **Email Editing**: Full editing capabilities with live preview

### 🔧 **Technical Features**
- **Secure API Integration**: Environment-based configuration for API keys
- **Precise Geolocation**: Mapbox geocoder with nearby address suggestions
- **Professional Email Formatting**: Proper structure, tone, and MP addressing
- **Article Content Analysis**: Automatic article fetching and content integration

## 🚀 How It Works

1. **📍 Address Selection**:
   - Type your postcode or address in the Mapbox geocoder
   - Select from dropdown suggestions
   - Choose your exact door-level address from nearby options

2. **🏛️ MP Identification**:
   - Automatic MP lookup based on your precise address
   - Display MP contact information and constituency details

3. **✍️ Email Composition**:
   - Select a topic that matters to you
   - Add your full name (address auto-populated)
   - Optionally include reference articles

4. **🤖 AI Generation**:
   - GPT-4.1-nano creates a personalized, professional email
   - Includes proper MP addressing, clear issue articulation, and specific asks

5. **📝 Review & Edit**:
   - Rich text editor with formatting toolbar
   - Edit content with bold, italic, headers, and lists
   - Live preview of final formatted email

6. **📧 Ready to Send**:
   - Copy the final email to send to your MP
   - All contact details provided for easy sending

## 🛠️ Technology Stack

### **Frontend**
- **HTML5/CSS3/JavaScript**: Modern web standards with ES6+ features
- **Bootstrap 5**: Responsive design framework with custom styling
- **Quill.js**: Rich text editor for email formatting
- **Mapbox GL JS**: Interactive maps and geocoding
- **FontAwesome**: Professional iconography

### **Backend**
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **OpenAI API**: GPT-4.1-nano model for email generation
- **Mapbox API**: Geocoding and address services
- **UK Parliament API**: MP data and constituency information

### **Deployment**
- **Railway**: Cloud platform deployment
- **Environment Variables**: Secure API key management
- **Git**: Version control with GitHub integration

## ⚙️ Setup & Installation

### **Prerequisites**
- Node.js 18+ (for built-in fetch support)
- OpenAI API key
- Mapbox API key

### **Installation Steps**

1. **Clone the repository**
   ```bash
   git clone https://github.com/muazamsarfaraz/dearpower.git
   cd dearpower
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # Mapbox API Configuration
   MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to `http://localhost:3000` in your browser

### **Production Deployment**
```bash
npm run start
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/config` | Get client configuration (Mapbox token) |
| `POST` | `/api/generate-email` | Generate AI-powered email content |
| `GET` | `/api/mp/:postcode` | Get MP information for postcode |

## 📁 Project Structure

```
dearpower/
├── css/                    # Stylesheets
│   ├── main.css           # Main application styles
│   ├── components.css     # Component-specific styles
│   └── utilities.css      # Utility classes
├── js/                    # JavaScript modules
│   ├── app.js            # Main application logic
│   ├── components.js     # UI component generators
│   ├── mapbox.js         # Mapbox integration
│   └── api.js            # API communication
├── index.html            # Main application page
├── server.js             # Express server
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (not in repo)
└── README.md            # This file
```

## 🌟 Key Features Explained

### **Enhanced Address Selection**
- **Mapbox Geocoder**: Professional address search with autocomplete
- **Precise Location**: Door-level accuracy for proper MP constituency matching
- **Multiple Selection Methods**: Geocoder dropdown, nearby addresses list, map clicking
- **UK-Focused**: Optimized for UK postcodes and addresses

### **AI Email Generation**
- **GPT-4.1-nano**: Cost-effective model optimized for professional communication
- **Context-Aware**: Incorporates MP name, constituency, and user details
- **Professional Tone**: Appropriate formality and structure for parliamentary communication
- **Article Integration**: Analyzes and incorporates reference material when provided

### **Rich Text Editing**
- **WYSIWYG Editor**: What-you-see-is-what-you-get editing experience
- **Formatting Toolbar**: Bold, italic, headers, numbered/bullet lists
- **Live Preview**: Real-time preview of formatted content
- **Markdown Compatibility**: Maintains markdown storage for backend compatibility

## 🔐 Security & Privacy

- **API Key Security**: All sensitive keys stored in environment variables
- **No Data Storage**: User data is not permanently stored
- **Secure Communication**: HTTPS in production
- **Client-Side Processing**: Address and MP data processed locally when possible

## 🚀 Live Application

**Production URL**: https://yellow-harbor-production.up.railway.app

## 📝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper testing
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### **Development Guidelines**
- Follow existing code style and structure
- Test all functionality before submitting
- Update documentation for new features
- Ensure mobile responsiveness
- Maintain accessibility standards

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: For providing the GPT-4.1-nano model
- **Mapbox**: For geocoding and mapping services
- **UK Parliament**: For providing MP data APIs
- **Railway**: For hosting and deployment platform

---

**Made with ❤️ for UK democracy and civic engagement**