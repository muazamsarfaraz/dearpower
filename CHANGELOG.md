# Changelog 📝

All notable changes to DearPower will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Email templates for common issues
- Draft saving functionality
- MP voting records display
- Community campaign features

## [1.3.0] - 2025-01-01

### Added
- **GPT-4.1-nano Integration**: Upgraded from gpt-4o-mini to GPT-4.1-nano for better cost efficiency
- **Model Discovery Script**: Added comprehensive script to list all available OpenAI models
- **Enhanced Documentation**: Complete project documentation overhaul

### Changed
- **AI Model**: Switched to GPT-4.1-nano for improved cost-effectiveness
- **Documentation**: Updated README.md with comprehensive project information
- **Project Structure**: Cleaned up root directory and removed outdated files

### Technical
- Updated OpenAI API integration to use latest model
- Improved error handling for model selection
- Enhanced system prompts for better email quality

## [1.2.0] - 2024-12-31

### Added
- **Rich Text Editor**: Implemented Quill.js WYSIWYG editor for email editing
- **Professional Formatting**: Bold, italic, headers, numbered/bullet lists
- **Live Preview**: Real-time preview of formatted email content
- **Enhanced User Experience**: No more markdown syntax visible to users

### Changed
- **Email Editing**: Replaced markdown textarea with professional rich text editor
- **User Interface**: Improved email composition and editing workflow
- **Content Formatting**: Automatic HTML to markdown conversion for backend storage

### Technical
- Integrated Quill.js rich text editor
- Added HTML to markdown conversion utilities
- Enhanced email preview and editing components
- Improved CSS styling for editor integration

## [1.1.0] - 2024-12-30

### Added
- **Enhanced Address Selection**: Mapbox-powered geocoder with precise door-level addressing
- **Nearby Address Suggestions**: Multiple address selection methods
- **Improved MP Lookup**: More accurate constituency matching based on exact location
- **Professional UI**: Enhanced visual design and user experience

### Changed
- **Address Input**: Replaced simple postcode input with advanced Mapbox geocoder
- **Location Accuracy**: Door-level precision for proper MP constituency matching
- **User Flow**: Streamlined address selection process

### Technical
- Integrated Mapbox GL JS and Geocoding API
- Enhanced address validation and selection logic
- Improved error handling for address lookup
- Added environment variable configuration for Mapbox

## [1.0.0] - 2024-12-29

### Added
- **Initial Release**: Core application functionality
- **MP Lookup**: Find MPs based on postcode using UK Parliament API
- **AI Email Generation**: OpenAI integration for professional email creation
- **Topic Selection**: Healthcare, education, environment, housing, cost of living options
- **Article Integration**: Reference external articles in email content
- **Email Review**: Copy-to-clipboard and email client integration
- **Production Deployment**: Live application on Railway platform

### Core Features
- **Step-by-step Workflow**: Guided user experience from address to email
- **Professional Email Generation**: AI-powered content creation
- **MP Contact Information**: Complete MP details and contact methods
- **Responsive Design**: Mobile-friendly Bootstrap 5 interface
- **Secure API Integration**: Environment-based configuration

### Technical Foundation
- **Node.js Backend**: Express server with RESTful API endpoints
- **Frontend**: Modern HTML5, CSS3, JavaScript (ES6+)
- **APIs**: OpenAI, UK Parliament, Postcodes.io integration
- **Deployment**: Railway cloud platform
- **Security**: Environment variable management for API keys

## [0.3.0] - 2024-12-28

### Added
- **Backend API**: Express server with email generation endpoints
- **OpenAI Integration**: AI-powered email content generation
- **Article Content Fetching**: Automatic article analysis and integration
- **Error Handling**: Comprehensive error handling throughout application

### Technical
- Node.js and Express backend implementation
- OpenAI API integration with o1-mini model
- Cheerio for web scraping and content analysis
- Environment variable configuration

## [0.2.0] - 2024-12-27

### Added
- **MP Lookup System**: UK Parliament API integration
- **Address Validation**: Postcode validation and autocomplete
- **User Interface**: Bootstrap 5 responsive design
- **Step Indicators**: Clear progress tracking through application flow

### Technical
- UK Parliament Members API integration
- Postcodes.io API for address validation
- Bootstrap 5 UI framework
- FontAwesome icons

## [0.1.0] - 2024-12-26

### Added
- **Project Foundation**: Initial project structure and setup
- **Basic HTML Structure**: Core application layout
- **CSS Framework**: Custom styling with utility classes
- **JavaScript Modules**: Modular frontend architecture

### Technical
- Project folder structure (css/, js/, components/)
- Basic HTML5 semantic structure
- CSS3 custom properties and responsive design
- ES6+ JavaScript modules

---

## Version History Summary

- **v1.3.0**: GPT-4.1-nano upgrade and documentation overhaul
- **v1.2.0**: Rich text editor and professional formatting
- **v1.1.0**: Enhanced address selection with Mapbox integration
- **v1.0.0**: Initial production release with core functionality
- **v0.3.0**: Backend API and AI integration
- **v0.2.0**: MP lookup and UI implementation
- **v0.1.0**: Project foundation and structure

---

## Development Notes

### Release Process
1. Update version in package.json
2. Update CHANGELOG.md with new features
3. Test all functionality locally
4. Deploy to Railway platform
5. Verify production deployment
6. Tag release in Git

### Versioning Strategy
- **Major (x.0.0)**: Breaking changes or major feature additions
- **Minor (0.x.0)**: New features and enhancements
- **Patch (0.0.x)**: Bug fixes and minor improvements

### Contributing
See [README.md](README.md) for contribution guidelines and development setup instructions.
