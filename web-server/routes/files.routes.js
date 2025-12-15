const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { listRootFiles } = require('../controllers/filesController');

router.get('/', authMiddleware, listRootFiles);

module.exports = router;
