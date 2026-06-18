const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 8080;
const app = express();

// Serve the React app build output
const STATIC_DIR = path.join(__dirname, 'public_react');

app.use(express.static(STATIC_DIR, {
  maxAge: '1h',
  index: 'index.html',
}));

// SPA fallback — all routes serve index.html so React Router handles them
app.get('*', (_req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Mini Star Child Care v2 running on port ' + PORT);
});
