const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  index: 'index.html'
}));

// Serve index.html for any unknown route (SPA fallback)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Mini Star Child Care running on port ' + PORT);
});
