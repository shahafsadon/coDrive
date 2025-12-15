const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../controllers/authController');

// POST /api/tokens
router.post('/', authenticateUser);

module.exports = router;
