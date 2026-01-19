require('dotenv').config();

const express = require('express');
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

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});



