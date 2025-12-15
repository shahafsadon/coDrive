const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// main API router
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const errorHandler = require('./middleware/errorMiddleware');

// must be AFTER routes
app.use(errorHandler);
