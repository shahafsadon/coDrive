const express = require('express');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
