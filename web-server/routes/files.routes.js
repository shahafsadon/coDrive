const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    listRootFiles,
    getFileById,                 // SCRUM-233
    getFileContent,
    formatFileContent,
    createFile,
    formatCreateFileResponse,
    deleteFile,
    formatDeleteFileResponse
} = require('../controllers/filesController');

// List root files
router.get('/', authMiddleware, listRootFiles);

// SCRUM-233 – Get file or folder details by id (metadata)
router.get(
    '/:id',
    authMiddleware,
    getFileById
);

// SCRUM-312 – Get file content via C++ server
router.get(
    '/content/:path',
    authMiddleware,
    getFileContent,
    formatFileContent
);


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
