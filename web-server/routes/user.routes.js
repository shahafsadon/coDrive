const express = require('express');
const router = express.Router();

const { authMiddleware: authenticateRequest } =
    require('../middleware/authMiddleware');

const { upload } = require('../middleware/upload');

const {
    registerUser,
    getUserById,
} = require('../controllers/userController');

// POST /api/users
router.post('/', upload.single('image'), registerUser);

// GET /api/users/:id
router.get('/:id', authenticateRequest, getUserById);

module.exports = router;
