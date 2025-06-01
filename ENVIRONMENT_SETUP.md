# Environment Setup Guide

## Overview
This guide explains how to set up the environment variables and secrets for the DearPower application with OpenAI o1-mini integration.

## Environment Variables

### Required Variables

Create a `.env` file in the root directory with the following variables:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Variable Descriptions

- **OPENAI_API_KEY**: Your OpenAI API key for accessing the o1-mini model
- **PORT**: The port number for the server (default: 3000)
- **NODE_ENV**: Environment mode (development, production, test)

## Security Features

### ✅ Implemented Security Measures

1. **Environment Variables**: API key stored in `.env` file, not in code
2. **Backend API**: All OpenAI calls go through backend, frontend never sees API key
3. **Gitignore Protection**: `.env` file is excluded from version control
4. **Error Handling**: Proper error responses without exposing sensitive information
5. **Validation**: Input validation on backend API endpoint

### 🔒 Security Architecture

```
Frontend → Backend API (/api/generate-email) → Environment Variable → OpenAI API
```

**Benefits:**
- API key never exposed to frontend/browser
- Centralized API call handling
- Easier to implement rate limiting and monitoring
- Better error handling and logging

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install the required `dotenv` package for environment variable support.

### 2. Create Environment File

Create a `.env` file in the root directory:

```bash
# Copy the template
cp .env.example .env  # If you have a template

# Or create manually
touch .env
```

### 3. Configure Variables

Add your OpenAI API key to the `.env` file:

```env
OPENAI_API_KEY=your_actual_api_key_here
PORT=3000
NODE_ENV=development
```

### 4. Start the Server

```bash
npm start
# or
node server.js
```

### 5. Verify Setup

Visit the test pages to verify everything is working:

- **Main Application**: http://localhost:3000
- **Backend API Test**: http://localhost:3000/test-backend-api.html
- **Model Integration Test**: http://localhost:3000/test-o1-mini.html

## Testing the Integration

### Environment Check

1. Open http://localhost:3000/test-backend-api.html
2. Click "Check Environment"
3. Should show: ✅ Backend API endpoint is responding correctly

### API Test

1. Fill in the test form with MP details
2. Click "Test Backend API"
3. Should generate an email using OpenAI o1-mini

### Frontend Integration Test

1. Click "Test Frontend Integration"
2. Should work seamlessly through the updated OpenAI helper

## Troubleshooting

### Common Issues

**❌ "OpenAI API key not configured on server"**
- Check that `.env` file exists in root directory
- Verify `OPENAI_API_KEY` is set in `.env`
- Restart the server after adding environment variables

**❌ "Backend API request failed"**
- Check server is running on correct port
- Verify API endpoint is accessible
- Check browser console for detailed error messages

**❌ "Error connecting to backend"**
- Ensure server is running (`node server.js`)
- Check port configuration
- Verify no firewall blocking the connection

### Debug Steps

1. **Check Environment Loading**:
   ```bash
   node -e "require('dotenv').config(); console.log('API Key loaded:', !!process.env.OPENAI_API_KEY);"
   ```

2. **Test API Key**:
   ```bash
   curl -X POST http://localhost:3000/api/generate-email \
     -H "Content-Type: application/json" \
     -d '{"mp":{"name":"Test MP"},"topic":"Test","constituency":"Test"}'
   ```

3. **Check Server Logs**:
   Look at the terminal running the server for error messages

## Production Deployment

### Environment Variables for Production

For production deployment, set environment variables through your hosting platform:

**Railway**:
```bash
railway variables set OPENAI_API_KEY=your_key_here
railway variables set NODE_ENV=production
```

**Heroku**:
```bash
heroku config:set OPENAI_API_KEY=your_key_here
heroku config:set NODE_ENV=production
```

**Vercel**:
Add environment variables in the Vercel dashboard or use CLI:
```bash
vercel env add OPENAI_API_KEY
```

### Security Considerations for Production

1. **Never commit `.env` files** - Already protected by `.gitignore`
2. **Use secure environment variable management** - Platform-specific solutions
3. **Implement rate limiting** - Prevent API abuse
4. **Add authentication** - Protect API endpoints
5. **Monitor API usage** - Track costs and usage patterns
6. **Log errors securely** - Don't log sensitive information

## File Structure

```
dearpower/
├── .env                    # Environment variables (not in git)
├── .gitignore             # Protects .env from being committed
├── server.js              # Backend with API endpoint
├── js/openai.js           # Frontend helper (uses backend API)
├── test-backend-api.html  # Backend API testing
└── package.json           # Dependencies including dotenv
```

## Next Steps

1. **Test thoroughly** - Use the provided test pages
2. **Monitor usage** - Track OpenAI API costs
3. **Implement rate limiting** - Prevent abuse
4. **Add user authentication** - Secure the API
5. **Deploy to production** - Use secure environment variable management
