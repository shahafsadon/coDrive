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

module.exports = {
    listRootFiles
};
