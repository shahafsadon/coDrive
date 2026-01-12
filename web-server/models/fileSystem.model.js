const { randomUUID } = require('crypto');

// In-memory storage: { [userId]: Map<nodeId, node> }
const fileSystem = {};

// Helper: Get or create user store
function getUserStore(userId) {
    if (!fileSystem[userId]) {
        fileSystem[userId] = new Map();
    }
    return fileSystem[userId];
}

// Find node globally across all stores
function findNodeGlobal(nodeId) {
    for (const store of Object.values(fileSystem)) {
        if (store.has(nodeId)) return store.get(nodeId);
    }
    return null;
}

// Helper: Calculate access recursively
function getEffectiveAccess(userId, nodeId) {
    let currentId = nodeId;
    
    while (currentId) {
        const node = findNodeGlobal(currentId);
        if (!node) break;

        // Owner always has write access
        if (node.ownerId === userId) return 'write';

        // Explicit permission
        const perm = node.permissions?.find(p => p.userId === userId);
        if (perm) return perm.access;

        // Go up to parent
        currentId = node.parentId;
    }
    
    return null; 
}

// Find node by name and parent
function findByNameAndParent(userId, name, parentId) {
    const store = getUserStore(userId);
    return Array.from(store.values()).find(
        node => node.name === name && node.parentId === parentId
    );
}

// Find folder by name
function findFolderByName(userId, folderName) {
    const store = getUserStore(userId);
    for (const node of store.values()) {
        if (node.type === 'folder' && node.name === folderName) {
            return node.id;
        }
    }
    return null; 
}

// Create new file/folder node
function createNode({ name, type, ownerId, parentId = null, content = null, filePath = null, mimeType = 'text/plain'}) {
    const store = getUserStore(ownerId);
    
    // Removed duplicate check to allow multiple files with same name (Google Drive style)
    
    const id = randomUUID();
    const node = {
        id,
        name,
        type,
        ownerId,
        parentId,

        content: type === 'file' ? content : null,
        filePath: type === 'file' ? filePath : null,
        mimeType: type === 'file' ? mimeType : null,
        permissions: [],
        createdAt: new Date().toISOString()
    };


    store.set(id, node);
    return node;
}

function getNodeById(userId, nodeId) {
    const node = findNodeGlobal(nodeId);
    if (!node) return null;

    const access = getEffectiveAccess(userId, nodeId);
    if (access) return node;

    return null;
}

// Get root nodes for user
function getRootNodes(userId) {
    const result = [];
    const seenIds = new Set();

    // My root files
    const myStore = getUserStore(userId);
    for (const node of myStore.values()) {
        if (node.parentId === null) {
            result.push({ ...node, accessLevel: 'write' });
            seenIds.add(node.id);
        }
    }

    // Shared directly with me
    for (const store of Object.values(fileSystem)) {
        for (const node of store.values()) {
            if (node.ownerId !== userId) {
                const access = getEffectiveAccess(userId, node.id);
                
                if (access && !seenIds.has(node.id)) {
                    if (node.permissions?.some(p => p.userId === userId)) {
                        result.push({ ...node, accessLevel: access });
                        seenIds.add(node.id);
                    }
                }
            }
        }
    }
    return result;
}

// Get children of a folder
function getChildren(userId, parentId) {
    const parentAccess = getEffectiveAccess(userId, parentId);
    if (!parentAccess) return [];

    const children = [];
    // My children
    for (const store of Object.values(fileSystem)) {
        for (const node of store.values()) {
            if (node.parentId === parentId) {
                const access = getEffectiveAccess(userId, node.id);
                if (access) {
                    children.push({ ...node, accessLevel: access });
                }
            }
        }
    }
    return children;
}

// Delete node recursively
function deleteNodeRecursive(userId, nodeId) {
    const store = getUserStore(userId);
    const node = findNodeGlobal(nodeId); 
    if (!node) return;

    if (node.ownerId === userId) {
        const myChildren = Array.from(store.values()).filter(n => n.parentId === nodeId);
        myChildren.forEach(child => deleteNodeRecursive(userId, child.id));
        store.delete(nodeId);
    }
}

// Search nodes by query
function searchNodes(userId, query) {
    const store = getUserStore(userId);
    const lowerQuery = query.toLowerCase();
    // Search in own files only for simplicity
    return Array.from(store.values())
        .filter(node => node.name.toLowerCase().includes(lowerQuery))
        .map(node => ({ ...node, accessLevel: 'write' }));
}

module.exports = {
    createNode,
    getNodeById,
    getRootNodes,
    getChildren,
    deleteNodeRecursive,
    searchNodes,
    findFolderByName,
    getEffectiveAccess 
};