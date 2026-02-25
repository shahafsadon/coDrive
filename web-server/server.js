require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');

// Get PORT from environment or default
const PORT = process.env.PORT || 3000;

// Validate required environment variables at startup
if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET environment variable is not set');
    process.exit(1);
}

if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI environment variable is not set');
    process.exit(1);
}

// Enable CORS for all origins in development
// In production, specify allowed origins
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json({
    type: ['application/json', 'application/*+json'],
    limit: '50mb'
}));

app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));

// Import error middleware
const { errorMiddleware } = require('./middleware/errorMiddleware');

// main API router
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Error middleware must be AFTER routes
app.use(errorMiddleware);

async function startServer() {
    await connectDB();

    // Listen on all interfaces (0.0.0.0) so external devices can connect
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT} - accessible from external IPs`);
    });
}
startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});



