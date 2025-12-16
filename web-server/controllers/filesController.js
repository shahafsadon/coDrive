const cppClient = require('../services/cppServerClient');
const { getRootNodes } = require('../models/fileSystem.model');

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
    getFileContent,
    formatFileContent
};
