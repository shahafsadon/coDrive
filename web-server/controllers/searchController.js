const { searchNodes } = require('../models/fileSystem.model');

/**
 * GET /search/:query
 */
async function search(req, res) {
    const { query } = req.params;
    const userId = req.user.id;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    const results = await searchNodes(userId, query);
    return res.json(results);
}

module.exports = {
    search
};
