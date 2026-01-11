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

// Update file/folder details
function updateFile(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) {
        return res.status(404).json({ error: 'Not found' });
    }

    // Security: Check effective access
    const access = getEffectiveAccess(req.user.id, node.id);
    if (access !== 'write') {
        return res.status(403).json({ error: 'Read-only access' });
    }

    let { name, content, parentId, parentName, isStarred, isTrashed } = req.body;

    // Handle parentName to parentId resolution
    if (parentName !== undefined) {
        if (parentName.trim() === "") {
            parentId = null; 
        } else {
            const foundId = findFolderByName(req.user.id, parentName);
            if (!foundId) {
                return res.status(404).json({ error: `Folder "${parentName}" not found` });
            }
            parentId = foundId;
        }
    }
    
    if (name && typeof name === 'string') {
        node.name = name;
    }

    if (typeof isStarred === "boolean") {
        node.isStarred = isStarred;
    }

    if (typeof isTrashed === "boolean") {
        node.isTrashed = isTrashed;
    }


    // Move Logic with Anti-Steal Protection
    if (parentId !== undefined) {
        if (node.id === parentId) {
            return res.status(400).json({ error: 'Cannot move folder into itself' });
        }
        if (parentId !== null) {
            // Check if the MOVER (User B) has write access to destination
            const destAccess = getEffectiveAccess(req.user.id, parentId);
            if (destAccess !== 'write') {
                return res.status(403).json({ error: 'No write access to destination' });
            }

            // SAFETY CHECK: Check if the OWNER (User A) has access to destination
            // This prevents User B from moving User A's file into a private folder User A can't see.
            if (node.ownerId !== req.user.id) {
                 const ownerDestAccess = getEffectiveAccess(node.ownerId, parentId);
                 if (!ownerDestAccess) {
                     return res.status(403).json({ error: 'Cannot move file to a folder the owner cannot see' });
                 }
            }

            // Verify destination is a folder
            const dest = getNodeById(req.user.id, parentId); 
            if (!dest || dest.type !== 'folder') {
                return res.status(400).json({ error: 'Destination invalid' });
            }
        }
        node.parentId = parentId;
    }

    // Update content for files
    if (node.type === 'file' && content !== undefined) {
        if (typeof content !== 'string'){
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

        if (!['file', 'folder'].includes(type)) return res.status(400).json({ error: 'Invalid type' });
        if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Name is required' });

        if (parentId) {
            const access = getEffectiveAccess(userId, parentId);
            if (access !== 'write') {
                return res.status(403).json({ error: 'No write access to parent folder' });
            }
            const parent = getNodeById(userId, parentId);
            if (!parent || parent.type !== 'folder') {
                return res.status(400).json({ error: 'Invalid parent folder' });
            }
        }

        const uploadedFile = req.file;
        // For files, either content (text) or uploaded file must be provided
        res.locals.nodeData = {
            type, name, parentId: parentId ?? null,
            content: type === 'file' && !uploadedFile ? content ?? '' : null,
            filePath: type === 'file' && uploadedFile ? uploadedFile.path : null,
            mimeType: type === 'file' ? (uploadedFile ? uploadedFile.mimetype : mimeType ?? 'text/plain') : null
        };
        next();
    } catch (err) { next(err); }
}

// Format response after file/folder creation
function formatCreateFileResponse(req, res) {
    const node = createNode({ ...res.locals.nodeData, ownerId: req.user.id });
    if (!node) return res.status(409).json({ error: 'File already exists' }); 
    return res.status(201).json(node);
}

// List root files/folders
function listRootFiles(req, res) {
    return res.status(200).json(getRootNodes(req.user.id)); 
}

// Get file/folder by ID
function getFileById(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });

    const accessLevel = getEffectiveAccess(req.user.id, node.id);

    if (node.type === 'folder'){
        return res.status(200).json({ 
            ...node, 
            children: getChildren(req.user.id, node.id),
            accessLevel 
        });
    }
    return res.status(200).json({ ...node, accessLevel });
}

// Download file content
function downloadFile(req, res) {
    let userId = req.user?.id;
    if (!userId && req.query.token) {
        try {
            const jwt = require("jsonwebtoken");
            userId = jwt.verify(req.query.token, process.env.JWT_SECRET || "secret").userId;
        } catch { return res.status(401).json({ error: "Invalid token" }); }
    }
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    // Fetch file
    const node = getNodeById(userId, req.params.id);
    if (!node || node.type !== 'file') return res.status(404).json({ error: 'File not found' });
    if (!node.filePath) return res.status(400).json({ error: 'File has no binary content' });

    res.type(node.mimeType);
    return res.sendFile(path.resolve(node.filePath));
}

// Delete file/folder
function deleteFile(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'Not found' });
    
    // Only owner can delete
    if (node.ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Only owner can delete files' });
    }
    
    deleteNodeRecursive(req.user.id, node.id); 
    return res.status(204).end();
}

// Permissions management
function getPermissions(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    return res.status(200).json(node.permissions);
}

// Add permission to a file/folder
function addPermission(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    const { username, access } = req.body;
    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    // Find target user
    const targetUser = findUserByUsername(username);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });
    if (!['read', 'write'].includes(access)) return res.status(400).json({ error: 'Invalid access type' });

    // Check if permission already exists
    const existing = node.permissions.find(p => p.userId === targetUser.id);
    if (existing) return res.status(400).json({ error: 'User already has permission' });

    // Add permission
    const permission = { id: randomUUID(), userId: targetUser.id, username: targetUser.username, access };
    node.permissions.push(permission);
    return res.status(201).json(permission);
}

// Update permission
function updatePermission(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    // Find permission
    const perm = node.permissions.find(p => p.id === req.params.pid);
    if (!perm) return res.status(404).json({ error: 'Permission not found' });
    if (!['read', 'write'].includes(req.body.access)) return res.status(400).json({ error: 'Invalid access' });

    // Update access
    perm.access = req.body.access;
    return res.status(204).end();
}

// Delete permission
function deletePermission(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    // Find permission
    node.permissions = node.permissions.filter(p => p.id !== req.params.pid);
    return res.status(204).end();
}

// Replace image file
function replaceImage(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node || node.type !== "file") return res.status(404).json({ error: "File not found" });
    
    // Check write access
    const access = getEffectiveAccess(req.user.id, node.id);
    if (access !== 'write') {
        return res.status(403).json({ error: 'Read-only access' });
    }

    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // Update file details
    node.filePath = req.file.path;
    node.mimeType = req.file.mimetype;
    node.name = req.file.originalname;
    node.content = null;
    return res.status(200).json(node);
}

module.exports = {
    listRootFiles, createFile, formatCreateFileResponse, getFileById, downloadFile, deleteFile,
    updateFile, replaceImage, getPermissions, addPermission, updatePermission, deletePermission
};