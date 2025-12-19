const { randomUUID } = require('crypto');

// In-memory storage: { [userId]: Map<id, node> }
const fileSystem = {};

function getUserStore(userId) {
    if (!fileSystem[userId]) {
        fileSystem[userId] = new Map();
    }
    return fileSystem[userId];
}

function createNode({ name, type, ownerId, parentId = null }) {
    const id = randomUUID();

    const node = {
        id,
        name,
        type,       // 'file' | 'folder'
        ownerId,
        parentId,   // null = root
        permissions: []
    };

    const store = getUserStore(ownerId);
    store.set(id, node);

    return node;
}

function getNodeById(userId, nodeId) {
    const store = getUserStore(userId);
    return store.get(nodeId);
}

function getRootNodes(userId) {
    const store = getUserStore(userId);
    return Array.from(store.values()).filter(node => node.parentId === null);
}

// SCRUM-324 – remove in-memory file record after successful deletion
function removeNode(userId, nodeId) {
    const store = getUserStore(userId);
    return store.delete(nodeId);
}

module.exports = {
    createNode,
    getNodeById,
    getRootNodes,
    removeNode,          
};
