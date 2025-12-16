const cppClient = require('../services/cppServerClient');
const { 
    getRootNodes,
    createNode        
} = require('../models/fileSystem.model');

// SCRUM 317 – send CREATE command to C++ server
async function createFile(req, res, next) {
    try {
        const { filename } = req.body;

        if (!filename || filename.trim() === '') {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const rawResponse = await cppClient.send(`CREATE ${filename}`);

        res.locals.cppResponse = rawResponse.trim();
        res.locals.filename = filename;

        next();
    } catch (err) {
        next(err);
    }
}

// Map CREATE response to HTTP + JSON
function formatCreateFileResponse(req, res) {
    const cppResponse = res.locals.cppResponse;

    if (cppResponse.startsWith('200')) {
        createNode({
            name: res.locals.filename,  
            type: 'file',
            ownerId: req.user.id
        });

        return res.status(201).end();
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
    // Successful response
    if (cppResponse.startsWith('200')) {
        return res.status(200).json({
            content: cppResponse.substring(4)
        });
    }

    // File not found
    if (cppResponse.startsWith('404')) {
        return res.status(404).json({
            error: 'File not found'
        });
    }

    // Server error
    if (cppResponse.startsWith('500')) {
        return res.status(500).json({
            error: 'Server error'
        });
    }

    // Fallback for unexpected responses
    return res.status(502).json({
        error: 'Bad response from C++ server',
        raw: cppResponse
    });
}

// Export controller functions
module.exports = {
    listRootFiles,
    createFile,
    formatCreateFileResponse,
    getFileContent,
    formatFileContent
};
