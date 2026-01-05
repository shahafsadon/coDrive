const { randomUUID } = require('crypto');

// In-memory storage: { [userId]: Map<nodeId, node> }
const fileSystem = {};

function getUserStore(userId) {
    if (!fileSystem[userId]) {
        fileSystem[userId] = new Map();
    }
    return fileSystem[userId];
}

/**
 * Find node by name under the same parent (per user)
 */
function findByNameAndParent(userId, name, parentId) {
    const store = getUserStore(userId);
    return Array.from(store.values()).find(
        node => node.name === name && node.parentId === parentId
    );
}

/**
 * Create a file or folder node
 * - Text files store content in `content`
 * - Binary files store path in `filePath`
 * - mimeType is stored for future use
 * - Returns null if duplicate name exists in same folder
 */
function createNode({
                        name,
                        type,
                        ownerId,
                        parentId = null,
                        content = null,
                        filePath = null,
                        mimeType = 'text/plain'
                    }) {
    const store = getUserStore(ownerId);

    // Prevent duplicate names in the same folder
    const existing = findByNameAndParent(ownerId, name, parentId);
    if (existing) {
        return null;
    }

    const id = randomUUID();

    const node = {
        id,
        name,
        type,               // 'file' | 'folder'
        ownerId,
        parentId,           // null = root
        content: type === 'file' ? content : null,     // TEXT ONLY
        filePath: type === 'file' ? filePath : null,   // BINARY FILE PATH
        mimeType: type === 'file' ? mimeType : null,
        permissions: []
    };

    store.set(id, node);
    return node;
}

/**
 * Get node by id
 */
function getNodeById(userId, nodeId) {
    const store = getUserStore(userId);
    return store.get(nodeId);
}

/**
 * Get all root-level nodes (parentId === null)
 */
function getRootNodes(userId) {
    const store = getUserStore(userId);
    return Array.from(store.values())
        .filter(node => node.parentId === null);
}

/**
 * Get children of a folder
 */
function getChildren(userId, parentId) {
    const store = getUserStore(userId);
    return Array.from(store.values())
        .filter(node => node.parentId === parentId);
}

/**
 * Recursively delete a node and all its descendants
 */
function deleteNodeRecursive(userId, nodeId) {
    const store = getUserStore(userId);
    const node = store.get(nodeId);

    if (!node) return;

    const children = getChildren(userId, nodeId);
    for (const child of children) {
        deleteNodeRecursive(userId, child.id);
    }

    store.delete(nodeId);
}

module.exports = {
    getUserStore,
    createNode,
    getNodeById,
    getRootNodes,
    getChildren,
    deleteNodeRecursive
};
