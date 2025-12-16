const express = require('express');
const router = express.Router();
// controllers
const searchController = require('../controllers/searchController');

// GET /api/search/:query
router.get(
  '/:query',
  // Middlewares from searchController 
  searchController.search,
  searchController.formatSearchResult
);

module.exports = router;
