const express = require('express');
const { registerUser } = require('../controllers/userController');

const router = express.Router();

// POST /api/users
router.post('/users', registerUser);

module.exports = router;
