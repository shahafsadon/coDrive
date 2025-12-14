const express = require('express');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
const healthRoutes = require('./routes/health.routes');
app.use('/api', healthRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
