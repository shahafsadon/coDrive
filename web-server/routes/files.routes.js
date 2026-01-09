const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const {
    listRootFiles,
    getFileById,
    createFile,
    formatCreateFileResponse,
    deleteFile,
    updateFile,
    downloadFile,
    replaceImage,
    // permissions
    getPermissions,
    addPermission,
    updatePermission,
    deletePermission
} = require('../controllers/filesController');

/* ROOT */
router.get('/', authMiddleware, listRootFiles);

router.post(
    '/',
    authMiddleware,
    upload.single('file'),
    createFile,
    formatCreateFileResponse
);

/* FILE ACTIONS */

// download image/file
router.get(
    '/:id/download',
    authMiddleware,
    downloadFile
);

// replace image
router.patch(
    '/:id/image',
    authMiddleware,
    upload.single('file'),
    replaceImage
);

/* PERMISSIONS */
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

/* GENERIC */
router.get('/:id', authMiddleware, getFileById);

router.patch('/:id', authMiddleware, updateFile);

router.delete('/:id', authMiddleware, deleteFile);

module.exports = router;
