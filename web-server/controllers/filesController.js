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

        let { type, name, parentId, content, mimeType, filePath } = req.body;

        if (!type) {
            type = 'folder';
        }

        if (!['file', 'folder'].includes(type)) {
            return res.status(400).json({ error: 'Invalid type' });
        }

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Name is required' });
        }

        if (type === 'file') {
            if (!parentId) {
                return res.status(400).json({
                    error: 'File must belong to a folder'
                });
            }

            const parent = getNodeById(userId, parentId);
            if (!parent || parent.type !== 'folder') {
                return res.status(400).json({
                    error: 'Invalid parent folder'
                });
            }

            // Either text OR binary file
            const hasText = content !== undefined;
            const hasBinary = filePath !== undefined;

            if (hasText && typeof content !== 'string') {
                return res.status(400).json({
                    error: 'Content must be a string'
                });
            }

            if (hasBinary && typeof filePath !== 'string') {
                return res.status(400).json({
                    error: 'filePath must be a string'
                });
            }

            if (!hasText && !hasBinary) {
                return res.status(400).json({
                    error: 'File must contain either content or filePath'
                });
            }

            if (!mimeType || typeof mimeType !== 'string') {
                return res.status(400).json({
                    error: 'mimeType is required for file'
                });
            }
        }

        res.locals.nodeData = {
            type,
            name,
            parentId: parentId ?? null,
            content: type === 'file' ? content ?? null : null,
            filePath: type === 'file' ? filePath ?? null : null,
            mimeType: type === 'file' ? mimeType : null
        };

        next();
    } catch (err) {
        next(err);
    }
}

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
 * GET /api/files/:id/download
 */
function downloadFile(req, res) {
    const node = getNodeById(req.user.id, req.params.id);

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
 * DELETE FILE / FOLDER
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
            node.content = content;
            node.filePath = null; // switching to text
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

module.exports = {
    listRootFiles,
    createFile,
    formatCreateFileResponse,
    getFileById,
    downloadFile,
    deleteFile,
    updateFile,
    getPermissions,
    addPermission,
    updatePermission,
    deletePermission
};
