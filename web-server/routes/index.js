const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const userRoutes = require('./user.routes');

// GET /api/health
router.use('/health', healthRoutes);

// POST /api/users
// GET  /api/users/:id
router.use('/users', userRoutes);

module.exports = router;
