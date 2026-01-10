const { searchNodes } = require('../models/fileSystem.model');

// Search functionality
const search = (req, res) => {
    const { query } = req.params;
    const userId = req.user.id; 

    // Check if query parameter is provided
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    // Perform search
    const results = searchNodes(userId, query);
    res.json(results);
};

module.exports = {
    search
};