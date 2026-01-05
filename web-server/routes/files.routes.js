const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    listRootFiles,
    getFileById,
    createFile,
    formatCreateFileResponse,
    deleteFile,
    updateFile,
    downloadFile,
    // permissions
    getPermissions,
    addPermission,
    updatePermission,
    deletePermission
} = require('../controllers/filesController');


// Root files
router.get('/', authMiddleware, listRootFiles);


// Create file / folder
router.post(
    '/',
    authMiddleware,
    createFile,
    formatCreateFileResponse
);


// File / Folder by ID
router.get(
    '/:id',
    authMiddleware,
    getFileById
);


// Download binary file (images, etc.)
router.get(
    '/:id/download',
    authMiddleware,
    downloadFile
);


// Update file / folder
router.patch(
    '/:id',
    authMiddleware,
    updateFile
);


// Delete file / folder
router.delete(
    '/:id',
    authMiddleware,
    deleteFile
);


// Permissions
router.get(
    '/:id/permissions',
    authMiddleware,
    getPermissions
);

router.post(
    '/:id/permissions',
    authMiddleware,
    addPermission
);

router.patch(
    '/:id/permissions/:pid',
    authMiddleware,
    updatePermission
);

router.delete(
    '/:id/permissions/:pid',
    authMiddleware,
    deletePermission
);

module.exports = router;
