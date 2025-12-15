const express = require('express');
const router = express.Router();

const {
    registerUser,
    getUserById,
} = require('../controllers/userController');

// POST /api/users
router.post('/', registerUser);

// GET /api/users/:id
router.get('/:id', getUserById);

module.exports = router;
