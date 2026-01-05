const { getUserStore } = require('../models/fileSystem.model');

/**
 * SEARCH FILES / FOLDERS
 * GET /api/search/:query
 */
exports.search = (req, res) => {
  const userId = req.user.id;
  const query = req.params.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      error: 'Search query is required'
    });
  }

  const store = getUserStore(userId);
  const q = query.toLowerCase();

  const results = Array.from(store.values()).filter(node => {
    // search by name
    if (node.name.toLowerCase().includes(q)) {
      return true;
    }

    // search by content (files only)
    if (
        node.type === 'file' &&
        typeof node.content === 'string' &&
        node.content.toLowerCase().includes(q)
    ) {
      return true;
    }

    return false;
  });

  return res.status(200).json(results);
};
