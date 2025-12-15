const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const userRoutes = require('./user.routes');
const tokenRoutes = require('./token.routes');

// GET /api/health
router.use('/health', healthRoutes);

// POST /api/users
// GET  /api/users/:id
router.use('/users', userRoutes);

router.use('/tokens', tokenRoutes);

module.exports = router;

const filesRoutes = require('./files.routes');

router.use('/files', filesRoutes);
