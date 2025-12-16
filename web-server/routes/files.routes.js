const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    listRootFiles,
    getFileContent,
    formatFileContent
} = require('../controllers/filesController');

// List root files
router.get('/', authMiddleware, listRootFiles);
// Get file content via C++ server
router.get('/:path', authMiddleware, getFileContent, formatFileContent);

module.exports = router;
