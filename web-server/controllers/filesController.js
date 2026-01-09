const {
    getRootNodes,
    createNode,
    getNodeById,
    getChildren,
    deleteNodeRecursive
} = require('../models/fileSystem.model');

const { randomUUID } = require('crypto');
const path = require('path');

/**
 * CREATE FILE / FOLDER
 * POST /api/files
 */
async function createFile(req, res, next) {
    try {
        const userId = req.user.id;

        let { type, name, parentId, content, mimeType } = req.body;

        // Default type
        if (!type) {
            type = 'folder';
        }

        if (!['file', 'folder'].includes(type)) {
            return res.status(400).json({ error: 'Invalid type' });
        }

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Name is required' });
        }

        // 🔹 If file has parent – validate parent folder
        if (parentId) {
            const parent = getNodeById(userId, parentId);
            if (!parent || parent.type !== 'folder') {
                return res.status(400).json({
                    error: 'Invalid parent folder'
                });
            }
        }

        const uploadedFile = req.file; // ← multer puts image here

        // 🔹 Build node data
        res.locals.nodeData = {
            type,
            name,
            parentId: parentId ?? null,

            // TEXT FILE
            content:
                type === 'file' && !uploadedFile
                    ? content ?? ''
                    : null,

            // IMAGE FILE
            filePath:
                type === 'file' && uploadedFile
                    ? uploadedFile.path
                    : null,

            mimeType:
                type === 'file'
                    ? uploadedFile
                        ? uploadedFile.mimetype
                        : mimeType ?? 'text/plain'
                    : null
        };

        next();
    } catch (err) {
        next(err);
    }
}

/**
 * FINALIZE CREATE
 */
function formatCreateFileResponse(req, res) {
    const node = createNode({
        ...res.locals.nodeData,
        ownerId: req.user.id
    });

    if (!node) {
        return res.status(409).json({
            error: 'File or folder with this name already exists'
        });
    }

    return res.status(201).json(node);
}

/**
 * LIST ROOT FILES
 */
function listRootFiles(req, res) {
    return res.status(200).json(
        getRootNodes(req.user.id)
    );
}

/**
 * GET FILE / FOLDER BY ID
 */
function getFileById(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) {
        return res.status(404).json({ error: 'File or folder not found' });
    }

    if (node.type === 'folder') {
        return res.status(200).json({
            ...node,
            children: getChildren(req.user.id, node.id)
        });
    }

    return res.status(200).json(node);
}

/**
 * DOWNLOAD FILE (binary)
 */
function downloadFile(req, res) {
    let userId = req.user?.id;

    // 🔹 allow token via query for <img>
    if (!userId && req.query.token) {
        try {
            const jwt = require("jsonwebtoken");
            const payload = jwt.verify(
                req.query.token,
                process.env.JWT_SECRET || "secret"
            );
            userId = payload.userId;
        } catch {
            return res.status(401).json({ error: "Invalid token" });
        }
    }

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const node = getNodeById(userId, req.params.id);

    if (!node || node.type !== 'file') {
        return res.status(404).json({ error: 'File not found' });
    }

    if (!node.filePath) {
        return res.status(400).json({ error: 'File has no binary content' });
    }

    res.type(node.mimeType);
    return res.sendFile(path.resolve(node.filePath));
}


/**
 * DELETE FILE / FOLDER (recursive)
 */
function deleteFile(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) {
        return res.status(404).json({ error: 'Not found' });
    }

    deleteNodeRecursive(req.user.id, node.id);
    return res.status(204).end();
}

/**
 * UPDATE FILE / FOLDER
 */
function updateFile(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) {
        return res.status(404).json({ error: 'Not found' });
    }

    const { name, content } = req.body;

    if (node.type === 'folder') {
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Folder name required' });
        }
        node.name = name;
        return res.status(204).end();
    }

    if (node.type === 'file') {
        if (name) node.name = name;

        if (content !== undefined) {
            if (typeof content !== 'string') {
                return res.status(400).json({ error: 'Content must be string' });
            }

            // switching image → text
            node.content = content;
            node.filePath = null;
            node.mimeType = 'text/plain';
        }

        return res.status(204).end();
    }
}

/**
 * PERMISSIONS
 */
function getPermissions(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });

    return res.status(200).json(node.permissions);
}

function addPermission(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    const { userId, access } = req.body;

    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });

    if (!userId || !['read', 'write'].includes(access)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const permission = { id: randomUUID(), userId, access };
    node.permissions.push(permission);

    return res.status(201).json(permission);
}

function updatePermission(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });

    const perm = node.permissions.find(p => p.id === req.params.pid);
    if (!perm) return res.status(404).json({ error: 'Permission not found' });

    if (!['read', 'write'].includes(req.body.access)) {
        return res.status(400).json({ error: 'Invalid access' });
    }

    perm.access = req.body.access;
    return res.status(204).end();
}

function deletePermission(req, res) {
    const node = getNodeById(req.user.id, req.params.id);
    if (!node) return res.status(404).json({ error: 'File not found' });
    if (node.ownerId !== req.user.id)
        return res.status(403).json({ error: 'Forbidden' });

    node.permissions = node.permissions.filter(
        p => p.id !== req.params.pid
    );
    return res.status(204).end();
}

/**
 * REPLACE IMAGE FILE
 * PATCH /api/files/:id/image
 */
function replaceImage(req, res) {
    const node = getNodeById(req.user.id, req.params.id);

    if (!node || node.type !== "file") {
        return res.status(404).json({ error: "File not found" });
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
    deletePermission
};
