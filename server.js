const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static('.'));

// Handle SPA routing - serve index.html for all routes that don't match static files
app.get('*', (req, res) => {
  // Don't serve index.html for API calls or file extensions
  if (req.path.includes('.') || req.path.startsWith('/api')) {
    return res.status(404).send('Not found');
  }
  
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DearPower server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
