const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// API endpoint to serve economic data
app.get('/api/data', (req, res) => {
  // Fetch or read economic data and send as JSON
  res.json({ message: 'Economic data endpoint' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});