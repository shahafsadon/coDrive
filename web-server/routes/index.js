const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const userRoutes = require('./user.routes');
const tokenRoutes = require('./token.routes');
const filesRoutes = require('./files.routes');
const searchRoutes = require('./search');

// GET /api/health
router.use('/health', healthRoutes);
// POST /api/users
// GET  /api/users/:id
router.use('/users', userRoutes);
// POST /api/tokens
router.use('/tokens', tokenRoutes);
// Files API
router.use('/files', filesRoutes);
// Search API
router.use('/search', searchRoutes);

module.exports = router;
