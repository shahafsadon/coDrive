const express = require('express');
const app = express();
const connectDB = require('./config/db');
const PORT = 3000;

app.use(express.json({
    type: ['application/json', 'application/*+json'],
    limit: '10mb'
}));


// main API router
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);


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


const errorHandler = require('./middleware/errorMiddleware');

// must be AFTER routes
app.use(errorHandler);



