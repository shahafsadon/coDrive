const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    listRootFiles,
    getFileContent,
    formatFileContent,
    createFile,
    formatCreateFileResponse,
    deleteFile,
    formatDeleteFileResponse
} = require('../controllers/filesController');

// List root files
router.get('/', authMiddleware, listRootFiles);

// Get file content via C++ server
router.get('/:path', authMiddleware, getFileContent, formatFileContent);

// Create file
router.post('/', authMiddleware, createFile, formatCreateFileResponse);

// Delete file
router.delete(
    '/:id',
    authMiddleware,
    deleteFile,
    formatDeleteFileResponse
);

module.exports = router;
