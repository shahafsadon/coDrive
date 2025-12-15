const express = require('express');
const router = express.Router();

const authenticateRequest = require('../middleware/authMiddleware');

const {
    registerUser,
    getUserById,
} = require('../controllers/userController');

// POST /api/users
router.post('/', registerUser);

// GET /api/users/:id
router.get('/:id', authenticateRequest, getUserById);

module.exports = router;
