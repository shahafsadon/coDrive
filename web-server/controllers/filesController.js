const cppClient = require('../services/cppServerClient');
const { 
    getRootNodes,
    createNode,
    removeNode         
} = require('../models/fileSystem.model');

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

        // Validate file existence in in-memory store
        const nodes = getRootNodes(req.user.id);
        const node = nodes.find(n => n.id === fileId);

        if (!node) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Send DELETE command to C++ server with filename
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

module.exports = {
    listRootFiles,
    createFile,
    formatCreateFileResponse,
    getFileContent,
    formatFileContent,
    deleteFile,
    formatDeleteFileResponse
};

