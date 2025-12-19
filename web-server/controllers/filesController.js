const cppClient = require('../services/cppServerClient');
const {
    getRootNodes,
    createNode,
    removeNode,
    getNodeById              
} = require('../models/fileSystem.model');
const { randomUUID } = require('crypto');

// SCRUM 317+226 – send CREATE command to C++ server
async function createFile(req, res, next) {
    try {
        const { name } = req.body;

        // Validation
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({
                error: 'File name is required'
            });
        }

        // Send CREATE command to C++ server
        const rawResponse = await cppClient.send(`POST ${name} _`);

        res.locals.cppResponse = rawResponse.trim();
        res.locals.filename = name;

        next();
    } catch (err) {
        next(err);
    }
}

// Map CREATE response to HTTP + JSON
function formatCreateFileResponse(req, res) {
    const cppResponse = res.locals.cppResponse;

    if (cppResponse.startsWith('200') || cppResponse.startsWith('201')) {
        const node = createNode({
            name: res.locals.filename,
            type: 'file',
            ownerId: req.user.id
        });

        res
            .status(201)
            .location(`/api/files/${node.id}`)
            .end();
        return;
    }

    if (cppResponse.startsWith('409')) {
        return res.status(409).json({
            error: 'File already exists'
        });
    }

    if (cppResponse.startsWith('500')) {
        return res.status(500).json({
            error: 'Server error'
        });
    }

    return res.status(502).json({
        error: 'Bad response from C++ server',
        raw: cppResponse
    });
}

// List root files for authenticated user
function listRootFiles(req, res, next) {
    try {
        const userId = req.user.id;
        const nodes = getRootNodes(userId);
        return res.status(200).json(nodes);
    } catch (err) {
        next(err);
    }
}

// SCRUM-233 – Get file or folder details by id
function getFileById(req, res) {
    const userId = req.user.id;
    const fileId = req.params.id;

    const node = getNodeById(userId, fileId);

    if (!node) {
        return res.status(404).json({
            error: 'File or folder not found'
        });
    }

    return res.status(200).json(node);
}

function getPermissions(req, res) {
    const userId = req.user.id;
    const fileId = req.params.id;

    const node = getNodeById(userId, fileId);

    if (!node) {
        return res.status(404).json({ error: 'File not found' });
    }

    if (node.ownerId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    return res.status(200).json(node.permissions || []);
}

function addPermission(req, res) {
    const requesterId = req.user.id;
    const fileId = req.params.id;
    const { userId, access } = req.body;

    if (!userId || !access || !['read', 'write'].includes(access)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const node = getNodeById(requesterId, fileId);

    if (!node) {
        return res.status(404).json({ error: 'File not found' });
    }

    if (node.ownerId !== requesterId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const permission = {
        id: randomUUID(),
        userId,
        access
    };

    node.permissions.push(permission);

    return res.status(201).json(permission);
}

function updatePermission(req, res) {
    const requesterId = req.user.id;
    const fileId = req.params.id;
    const permissionId = req.params.pid;
    const { access } = req.body;

    if (!access || !['read', 'write'].includes(access)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const node = getNodeById(requesterId, fileId);

    if (!node) {
        return res.status(404).json({ error: 'File not found' });
    }

    if (node.ownerId !== requesterId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const permission = node.permissions.find(p => p.id === permissionId);

    if (!permission) {
        return res.status(404).json({ error: 'Permission not found' });
    }

    permission.access = access;

    return res.status(204).end();
}

function deletePermission(req, res) {
    const requesterId = req.user.id;
    const fileId = req.params.id;
    const permissionId = req.params.pid;

    const node = getNodeById(requesterId, fileId);

    if (!node) {
        return res.status(404).json({ error: 'File not found' });
    }

    if (node.ownerId !== requesterId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const index = node.permissions.findIndex(p => p.id === permissionId);

    if (index === -1) {
        return res.status(404).json({ error: 'Permission not found' });
    }

    node.permissions.splice(index, 1);

    return res.status(204).end();
}

// SCRUM 312–313: send GET command to C++ server
async function getFileContent(req, res, next) {
    try {
        const filePath = req.params.path;

        const rawResponse = await cppClient.send(`GET ${filePath}`);
        const responseLine = rawResponse.trim();

        res.locals.cppResponse = responseLine;
        next();
    } catch (err) {
        next(err);
    }
}

// SCRUM 314–315: map C++ response to HTTP + JSON
function formatFileContent(req, res) {
    const cppResponse = res.locals.cppResponse;
    const statusCode = parseInt(cppResponse, 10);

    if (statusCode === 200) {
        return res.status(200).json({
            content: cppResponse.substring(4)
        });
    }

    if (statusCode === 404) {
        return res.status(404).json({ error: 'File not found' });
    }

    if (statusCode === 500) {
        return res.status(500).json({ error: 'Server error' });
    }

    return res.status(502).json({
        error: 'Bad response from C++ server',
        raw: cppResponse
    });
}

// SCRUM-322 – send DELETE command to the C++ server
async function deleteFile(req, res, next) {
    try {
        const fileId = req.params.id;

        const nodes = getRootNodes(req.user.id);
        const node = nodes.find(n => n.id === fileId);

        if (!node) {
            return res.status(404).json({ error: 'File not found' });
        }

        const rawResponse = await cppClient.send(`DELETE ${node.name}`);

        res.locals.cppResponse = rawResponse.trim();
        res.locals.fileId = fileId;

        next();
    } catch (err) {
        next(err);
    }
}

// SCRUM-323–325: handle DELETE response + update in-memory state
function formatDeleteFileResponse(req, res) {
    const cppResponse = res.locals.cppResponse;
    const statusCode = parseInt(cppResponse, 10);

    if (statusCode === 200 || statusCode === 204) {
        removeNode(req.user.id, res.locals.fileId);
        return res.status(204).end();
    }

    if (statusCode === 404) {
        return res.status(404).json({ error: 'File not found' });
    }

    if (statusCode === 500) {
        return res.status(500).json({ error: 'Server error' });
    }

    return res.status(502).json({
        error: 'Bad response from C++ server',
        raw: cppResponse
    });
}

// SCRUM-239 – Update file or folder (metadata only)
async function updateFile(req, res, next) {
    try {
        const userId = req.user.id;
        const fileId = req.params.id;
        const { name } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({
                error: 'Name is required'
            });
        }

        const node = getNodeById(userId, fileId);
        if (!node) {
            return res.status(404).json({
                error: 'File or folder not found'
            });
        }

        // Update metadata only (no C++ call)
        res.locals.node = node;
        res.locals.newName = name;
        next();
    } catch (err) {
        next(err);
    }
}

function formatUpdateFileResponse(req, res) {
    res.locals.node.name = res.locals.newName;
    return res.status(204).end();
}

module.exports = {
    listRootFiles,
    createFile,
    formatCreateFileResponse,
    getFileById,            
    getFileContent,
    formatFileContent,
    deleteFile,
    formatDeleteFileResponse,
    updateFile,              
    formatUpdateFileResponse,
    // permissions
    getPermissions,
    addPermission,
    updatePermission,
    deletePermission
};
