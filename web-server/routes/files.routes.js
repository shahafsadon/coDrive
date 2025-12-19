const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    listRootFiles,
    getFileById,                
    getFileContent,
    formatFileContent,
    createFile,
    formatCreateFileResponse,
    deleteFile,
    formatDeleteFileResponse,
    updateFile,
    formatUpdateFileResponse,
    // permission-related handlers 
    getPermissions,
    addPermission,
    updatePermission,
    deletePermission
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

// SCRUM-239 – Update file or folder (rename)
router.patch(
    '/:id',
    authMiddleware,
    updateFile,
    formatUpdateFileResponse
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


// File permissions
// Get permissions of a file/folder
router.get(
    '/:id/permissions',
    authMiddleware,
    getPermissions
);

// Add permission
router.post(
    '/:id/permissions',
    authMiddleware,
    addPermission
);

// Update permission
router.patch(
    '/:id/permissions/:pid',
    authMiddleware,
    updatePermission
);

// Delete permission
router.delete(
    '/:id/permissions/:pid',
    authMiddleware,
    deletePermission
);


module.exports = router;
