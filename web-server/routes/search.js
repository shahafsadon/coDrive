const express = require('express');
const router = express.Router();

const { authMiddleware: auth } =
    require('../middleware/authMiddleware');

const { search } = require('../controllers/searchController');

// GET /api/search/:query
router.get('/:query', auth, search);

module.exports = router;
