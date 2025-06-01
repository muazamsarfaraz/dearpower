# DearPower Memory Bank

## Project Overview
DearPower is a civic engagement platform that helps UK citizens contact their MPs effectively. The platform streamlines the process of finding your MP, composing messages, and getting assistance with writing.

## Key Features
1. **Address/Postcode Lookup** - Using Mapbox for accurate UK address search
2. **MP Discovery** - Find your MP based on your constituency
3. **AI-Powered Email Generation** - Use OpenAI o1-mini to help compose effective emails
4. **Reference Integration** - Allow users to include articles/references in their communications

## Technical Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**:
  - Mapbox GL JS & Geocoding API (address lookup & maps)
  - UK Parliament Members API (MP data)
  - OpenAI API (GPT-4 Mini for email generation)
  - Postcodes.io (postcode validation)

## API Keys & Configuration
- Mapbox Token: `pk.eyJ1IjoibXVhemFtc2FyZmFyYXoiLCJhIjoiY205b2dzdnVlMTVuZDJqczcwbnBseW1tYiJ9.-MvfX63GtzUQceap1g6iJQ`
- OpenAI API: To be configured
- Parliament API: No key required (public API)

## User Flow
1. **Welcome/Explanation** → User understands the purpose
2. **Address Input** → Mapbox autocomplete helps find exact address
3. **MP Display** → Show MP details based on constituency
4. **Email Composition** → AI assistance with option to add references
5. **Send/Copy** → Final review and send options

## Design Principles
- Clean, modern UI with clear progression
- Accessibility-first approach
- Mobile-responsive design
- Progressive enhancement

## Component Structure
```
/css
  - main.css (main styles)
  - components.css (reusable components)
  - utilities.css (utility classes)
/js
  - app.js (main application logic)
  - api.js (API integrations)
  - components.js (UI components)
  - mapbox.js (Mapbox specific functions)
  - openai.js (OpenAI integration)
/components
  - templates.js (HTML templates)
index.html (main entry point)
```

## Color Palette
- Primary: #1e40af (Indigo 800)
- Primary Light: #3b82f6 (Blue 500)
- Success: #10b981 (Green 500)
- Danger: #ef4444 (Red 500)
- Grays: Various shades for text and backgrounds

## Key Decisions
- Separate concerns into modules
- Use modern ES6+ features
- Implement proper error handling
- Focus on user experience and clarity 