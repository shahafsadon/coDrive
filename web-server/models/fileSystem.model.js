const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

/**
 * @typedef {Object} Permission
 * @property {string} userId
 * @property {string} username
 * @property {'read'|'write'} access
 */

const permissionSchema = new mongoose.Schema(
    {
        id: { type: String },
        userId: { type: String, required: true },
        username: { type: String },
        access: {
            type: String,
            enum: ['read', 'write'],
            required: true,
        },
    },
    { _id: false }
);

/**
 * @typedef {Object} FileSystemNodeDoc
 * @property {string} id
 * @property {string} name
 * @property {'file'|'folder'} type
 * @property {string} ownerId
 * @property {string|null} parentId
 * @property {string|null} content
 * @property {string|null} filePath
 * @property {string|null} mimeType
 * @property {boolean} isStarred
 * @property {boolean} isTrashed
 * @property {Permission[]} permissions
 */

const fileSystemSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['file', 'folder'], required: true },
    ownerId: { type: String, required: true, index: true },
    parentId: { type: String, default: null, index: true },
    content: { type: String, default: null },
    filePath: { type: String, default: null },
    mimeType: { type: String, default: null },
    isStarred: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
    permissions: { type: [permissionSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
});

const FileSystemNode = mongoose.model('FileSystemNode', fileSystemSchema);

/**
 * Create file or folder
 */
async function createNode({ name, type, ownerId, parentId = null, content = null,
                              filePath = null, mimeType = 'text/plain' }) {
    const node = new FileSystemNode({
        id: randomUUID(),
        name,
        type,
        ownerId,
        parentId,
        content: type === 'file' ? content : null,
        filePath: type === 'file' ? filePath : null,
        mimeType: type === 'file' ? mimeType : null,
        permissions: [],
    });

    return node.save();
}

/**
 * Find node by external id
 */
async function findNodeGlobal(nodeId) {
    if (!nodeId) return null;
    return FileSystemNode.findOne({ id: nodeId }).lean();
}

async function findNodeGlobalFull(nodeId) {
    if (!nodeId) return null;
    return FileSystemNode.findOne({ id: nodeId });
}

/**
 * Resolve effective access recursively
 */
async function getEffectiveAccess(userId, nodeId) {
    let currentId = nodeId;

    while (currentId) {
        const node = await findNodeGlobal(currentId);
        if (!node) break;

        if (node.ownerId === userId) return 'write';

        const perm = node.permissions?.find(p => p.userId === userId);
        if (perm) return perm.access;

        currentId = node.parentId;
    }

    return null;
}

/**
 * Get node by id with access check
 */
async function getNodeById(userId, nodeId) {
    const access = await getEffectiveAccess(userId, nodeId);
    if (!access) return null;
    return findNodeGlobalFull(nodeId);
}

/**
 * Get children of folder
 */
async function getChildren(userId, parentId) {
    const access = await getEffectiveAccess(userId, parentId);
    if (!access) return [];

    const nodes = await FileSystemNode.find({ parentId
    }).lean();

    return nodes
        .map(node => ({
            ...node,
            accessLevel: access,
            isSharedWithMe: node.ownerId !== userId,
        }));
}

/**
 * Get root nodes
 */
async function getRootNodes(userId) {
    const result = [];
    const seen = new Set();

    const own = await FileSystemNode.find({ ownerId: userId,
        parentId: null }).lean();
    for (const node of own) {
        result.push({ ...node, accessLevel: 'write', isSharedWithMe: false });
        seen.add(node.id);
    }

    const shared = await FileSystemNode.find({ ownerId:
            { $ne: userId }, isTrashed: false }).lean();
    for (const node of shared) {
        if (seen.has(node.id)) continue;
        const access = await getEffectiveAccess(userId, node.id);
        if (!access) continue;
        if (node.permissions?.some(p => p.userId === userId)) {
            result.push({ ...node, accessLevel: access, isSharedWithMe: true });
        }
    }

    return result;
}

/**
 * Search nodes
 */
async function searchNodes(userId, query) {
    const q = query.toLowerCase();
    const nodes = await FileSystemNode.find({ 
        ownerId: userId,
        isTrashed: false 
    }).lean();

    return nodes
        .filter(node => {
            if (!node.name?.toLowerCase().includes(q)) {
                if (node.type !== 'file') return false;
                if (!node.content) return false;
                return node.content.toLowerCase().includes(q);
            }
            return true;
        })
        .map(node => ({ ...node, accessLevel: 'read' }));
}

/**
 * Delete recursively (owner only)
 */
async function deleteNodeRecursive(userId, nodeId) {
    const node = await findNodeGlobal(nodeId);
    if (!node || node.ownerId !== userId) return;

    const children = await FileSystemNode.find({ parentId: nodeId,
        ownerId: userId }).lean();
    for (const child of children) {
        await deleteNodeRecursive(userId, child.id);
    }

    await FileSystemNode.deleteOne({ id: nodeId });
}

/**
 * Helpers restored for parity
 */
async function findByNameAndParent(userId, name, parentId) {
    return FileSystemNode.findOne({ ownerId: userId,
        name, parentId }).lean();
}

async function findFolderByName(userId, folderName) {
    const folder = await FileSystemNode.findOne({ ownerId: userId,
        type: 'folder', name: folderName }).lean();
    return folder ? folder.id : null;
}

module.exports = {
    FileSystemNode,
    createNode,
    findNodeGlobal,
    findNodeGlobalFull,
    getEffectiveAccess,
    getNodeById,
    getChildren,
    getRootNodes,
    searchNodes,
    deleteNodeRecursive,
    findByNameAndParent,
    findFolderByName,
};
