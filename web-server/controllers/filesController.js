const {
    getRootNodes,
    createNode,
    getNodeById,
    getChildren,
    deleteNodeRecursive,
    findFolderByName,
    getEffectiveAccess
} = require('../models/fileSystem.model');

const { findUserByUsername } = require('../models/user.model');
const { randomUUID } = require('crypto');
const path = require('path');
const jwt = require("jsonwebtoken");

// Update file/folder details
async function updateFile(req, res) {
    const node = await getNodeById(req.user.id, req.params.id);
    if (!node) {
        return res.status(404).json({ error: 'Not found' });
    }

    const {
        name,
        content,
        parentId,
        parentName,
        isStarred,
        isTrashed
    } = req.body;

    const access = await getEffectiveAccess(req.user.id, node.id);
    if (!access) return res.status(403).json({ error: 'Access denied' });

    const isWriteOperation = (
        name !== undefined ||
        content !== undefined ||
        parentId !== undefined ||
        parentName !== undefined ||
        isTrashed !== undefined
    );

    if (isWriteOperation && access !== 'write') {
        return res.status(403).json({ error: 'Read-only access' });
    }

    if (typeof isStarred === 'boolean') {
        node.isStarred = isStarred;
    }

    if (typeof isTrashed === 'boolean') {
        node.isTrashed = isTrashed;
    }

    if (typeof name === 'string') {
        node.name = name;
    }

    // parentName → parentId
    let resolvedParentId = parentId;
    if (parentName !== undefined) {
        if (parentName.trim() === '') {
            resolvedParentId = null;
        } else {
            const foundId = await findFolderByName(req.user.id, parentName);
            if (!foundId) {
                return res.status(404).json({ error: `Folder "${parentName}" not found` });
            }
            resolvedParentId = foundId;
        }
    }

    if (resolvedParentId !== undefined) {
        if (node.id === resolvedParentId) {
            return res.status(400).json({ error: 'Cannot move folder into itself' });
        }

        if (resolvedParentId !== null) {
            const destAccess = await getEffectiveAccess(req.user.id, resolvedParentId);
            if (destAccess !== 'write') {
                return res.status(403).json({ error: 'No write access to destination' });
            }

            const dest = await getNodeById(req.user.id, resolvedParentId);
            if (!dest || dest.type !== 'folder') {
                return res.status(400).json({ error: 'Destination invalid' });
            }
        }

        node.parentId = resolvedParentId;
    }

    if (node.type === 'file' && content !== undefined) {
        if (typeof content !== 'string') {
            return res.status(400).json({ error: 'Content must be string' });
        }
        node.content = content;
        node.filePath = null;
        node.mimeType = 'text/plain';
    }

    return res.status(204).end();
}

// Middleware to prepare file/folder creation
async function createFile(req, res, next) {
    try {
        const userId = req.user.id;
        let { type, name, parentId, content, mimeType } = req.body;
        if (!type) type = 'folder';

        if (!['file', 'folder'].includes(type)) {
            return res.status(400).json({ error: 'Invalid type' });
        }

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Name is required' });
        }

        if (parentId) {
            const access = await getEffectiveAccess(userId, parentId);
            if (access !== 'write') {
                return res.status(403).json({ error: 'No write access to parent folder' });
            }

            const parent = await getNodeById(userId, parentId);
            if (!parent || parent.type !== 'folder') {
                return res.status(400).json({ error: 'Invalid parent folder' });
            }
        }

        const uploadedFile = req.file;

        res.locals.nodeData = {
            type,
            name,
            parentId: parentId ?? null,
            content: type === 'file' && !uploadedFile ? content ?? '' : null,
            filePath: type === 'file' && uploadedFile ? uploadedFile.path : null,
            mimeType: type === 'file'
                ? (uploadedFile ? uploadedFile.mimetype : mimeType ?? 'text/plain')
                : null
        };

        next();
    } catch (err) {
        next(err);
    }
}

// Format response after file/folder creation
async function formatCreateFileResponse(req, res) {
    const node = await createNode({ ...res.locals.nodeData, ownerId: req.user.id });
    return res.status(201).json(node);
}

// List root files/folders
async function listRootFiles(req, res) {
    const nodes = await getRootNodes(req.user.id);
    return res.status(200).json(nodes);
}

// Get file/folder by ID
async function getFileById(req, res) {
    const node = await getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });

    const accessLevel = await getEffectiveAccess(req.user.id, node.id);

    if (node.type === 'folder') {
        const children = await getChildren(req.user.id, node.id);
        return res.status(200).json({
            ...node,
            children,
            accessLevel
        });
    }

    return res.status(200).json({ ...node, accessLevel });
}

// Download file content
async function downloadFile(req, res) {
    let userId = req.user?.id;
    const secret = process.env.JWT_SECRET || "secret";

    if (!userId && req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, secret);
            userId = decoded.id || decoded.userId;
        } catch {}
    }

    if (!userId && req.query.token) {
        try {
            const decoded = jwt.verify(req.query.token, secret);
            userId = decoded.id || decoded.userId;
        } catch {}
    }

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const node = await getNodeById(userId, req.params.id);
    if (!node || node.type !== 'file') {
        return res.status(404).json({ error: 'File not found' });
    }

    if (!node.filePath) {
        return res.status(400).json({ error: 'File has no binary content' });
    }

    if (node.mimeType.startsWith('image/')) {
        res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(node.name)}"`);
    } else {
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(node.name)}"`);
    }

    res.type(node.mimeType);
    return res.sendFile(path.resolve(node.filePath));
}

// Soft delete (move to trash)
async function deleteFile(req, res) {
    const node = await getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'Not found' });

    if (node.ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Only owner can delete files' });
    }

    node.isTrashed = true;
    return res.status(204).end();
}

// Permissions management
async function getPermissions(req, res) {
    const node = await getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    return res.status(200).json(node.permissions);
}

async function addPermission(req, res) {
    const node = await getNodeById(req.user.id, req.params.id);
    const { username, access } = req.body;

    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const targetUser = await findUserByUsername(username);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });
    if (!['read', 'write'].includes(access)) {
        return res.status(400).json({ error: 'Invalid access type' });
    }

    const existing = node.permissions.find(p => p.userId === targetUser.id);
    if (existing) {
        return res.status(400).json({ error: 'User already has permission' });
    }

    const permission = {
        id: randomUUID(),
        userId: targetUser.id,
        username: targetUser.username,
        access
    };

    node.permissions.push(permission);
    return res.status(201).json(permission);
}

async function updatePermission(req, res) {
    const node = await getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const perm = node.permissions.find(p => p.id === req.params.pid);
    if (!perm) return res.status(404).json({ error: 'Permission not found' });
    if (!['read', 'write'].includes(req.body.access)) {
        return res.status(400).json({ error: 'Invalid access' });
    }

    perm.access = req.body.access;
    return res.status(204).end();
}

async function deletePermission(req, res) {
    const node = await getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    node.permissions = node.permissions.filter(p => p.id !== req.params.pid);
    return res.status(204).end();
}

async function replaceImage(req, res) {
    const node = await getNodeById(req.user.id, req.params.id);
    if (!node || node.type !== "file") {
        return res.status(404).json({ error: "File not found" });
    }

    const access = await getEffectiveAccess(req.user.id, node.id);
    if (access !== 'write') {
        return res.status(403).json({ error: 'Read-only access' });
    }

    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }

    node.filePath = req.file.path;
    node.mimeType = req.file.mimetype;
    node.name = req.file.originalname;
    node.content = null;

    return res.status(200).json(node);
}

async function deleteFilePermanent(req, res) {
    const node = await getNodeById(req.user.id, req.params.id);
    if (!node || !node.isTrashed) {
        return res.status(404).json({ error: "Not found" });
    }

    await deleteNodeRecursive(req.user.id, node.id);
    return res.status(204).end();
}

module.exports = {
    listRootFiles,
    createFile,
    formatCreateFileResponse,
    getFileById,
    downloadFile,
    deleteFile,
    updateFile,
    replaceImage,
    getPermissions,
    addPermission,
    updatePermission,
    deletePermission,
    deleteFilePermanent
};
