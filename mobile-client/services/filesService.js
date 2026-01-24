/**
 * Files Service for Mobile Client
 * Adapted from web-client with React Native compatibility
 * Uses same API endpoints and logic as web version
 */

import { api, getAPIBaseURL } from './api';
import { logger } from './logger';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Get files - either all files or children of a specific folder
 * @param {string|null} parentId - Parent folder ID (null for root)
 * @returns {Promise<Array>} Array of files/folders
 */
export async function getFiles(parentId = null) {
    try {
        const endpoint = parentId ? `/files/${parentId}` : '/files';
        const response = await api.get(endpoint);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        // Handle both array response and object with children
        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data?.children) {
            return response.data.children;
        }
        
        return [];
    } catch (err) {
        logger.error('FilesService', 'getFiles failed', err);
        throw err;
    }
}

/**
 * Search files by query string
 * @param {string} query - Search term
 * @returns {Promise<Array>} Matching files
 */
export async function searchFiles(query) {
    try {
        const response = await api.get(`/search/${encodeURIComponent(query)}`);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        logger.error('FilesService', 'searchFiles failed', err);
        throw err;
    }
}


/**
 * Create a new file or folder
 * @param {string} name - File/folder name
 * @param {string} type - 'file' or 'folder'
 * @param {string|null} parentId - Parent folder ID
 * @returns {Promise<Object>} Created file/folder
 */
export async function createFile(name, type, parentId = null) {
    try {
        const body = { name, type };
        
        if (parentId !== null) {
            body.parentId = parentId;
        }
        
        // If creating a text file, add default content
        if (type === 'file') {
            body.content = '';
            body.mimeType = 'text/plain';
        }
        
        const response = await api.post('/files', body);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Created ${type}: ${name}`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'createFile failed', err);
        throw err;
    }
}

/**
 * Rename a file or folder
 * @param {string} id - File/folder ID
 * @param {string} newName - New name
 * @returns {Promise<Object>} Updated file/folder
 */
export async function renameFile(id, newName) {
    try {
        const response = await api.patch(`/files/${id}`, { name: newName });
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Renamed file ${id} to ${newName}`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'renameFile failed', err);
        throw err;
    }
}

/**
 * Move file/folder to another location
 * @param {string} id - File/folder ID
 * @param {string} parentName - Target parent folder name (empty string for root)
 * @returns {Promise<Object>} Updated file/folder
 */
export async function moveFile(id, parentName) {
    try {
        const response = await api.patch(`/files/${id}`, { parentName });
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Moved file ${id} to ${parentName || 'root'}`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'moveFile failed', err);
        throw err;
    }
}

/**
 * Soft delete - move to trash
 * @param {string} id - File/folder ID
 * @returns {Promise<Object>} Updated file/folder
 */
export async function deleteFile(id) {
    try {
        const response = await api.delete(`/files/${id}`);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Deleted file ${id} (moved to trash)`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'deleteFile failed', err);
        throw err;
    }
}

/**
 * Permanent delete - remove completely
 * @param {string} id - File/folder ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteFilePermanent(id) {
    try {
        const response = await api.delete(`/files/${id}/permanent`);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Permanently deleted file ${id}`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'deleteFilePermanent failed', err);
        throw err;
    }
}

/**
 * Update file properties (including star status, trash status, etc.)
 * @param {string} id - File/folder ID
 * @param {Object} data - Properties to update
 * @returns {Promise<Object>} Updated file/folder
 */
export async function updateFile(id, data) {
    try {
        const response = await api.patch(`/files/${id}`, data);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Updated file ${id}`, data);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'updateFile failed', err);
        throw err;
    }
}

/**
 * Get file by ID (with full details including content)
 * @param {string} id - File ID
 * @returns {Promise<Object>} File details
 */
export async function getFileById(id) {
    try {
        const response = await api.get(`/files/${id}`);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'getFileById failed', err);
        throw err;
    }
}

/**
 * Upload a file (image or generic)
 * @param {string} name - File name
 * @param {string|null} parentId - Parent folder ID
 * @param {Object} fileUri - File URI object from picker {uri, name, type}
 * @returns {Promise<Object>} Uploaded file
 */
export async function uploadFile(name, parentId, fileUri) {
    const ALLOWED_FILE_TYPES = [
        'text/plain',
        'application/pdf'
    ];

    if (!ALLOWED_FILE_TYPES.includes(fileUri.type)) {
        throw new Error('Only text files and PDF files are supported');
    }


    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', 'file');
        
        if (parentId !== null) {
            formData.append('parentId', parentId);
        }
        
        // Create file object for FormData
        const file = {
            uri: fileUri.uri,
            name: fileUri.name || name,
            type: fileUri.type || 'application/octet-stream'
        };
        
        formData.append('file', file);
        
        const response = await api.postFormData('/files', formData);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Uploaded file: ${name}`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'uploadFile failed', err);
        throw err;
    }
}

/**
 * Toggle star status of a file
 * @param {string} id - File ID
 * @param {boolean} isStarred - Current star status
 * @returns {Promise<Object>} Updated file
 */
export async function toggleStar(id, isStarred) {
    return updateFile(id, { isStarred: !isStarred });
}

/**
 * Restore file from trash
 * @param {string} id - File ID
 * @returns {Promise<Object>} Restored file
 */
export async function restoreFile(id) {
    return updateFile(id, { isTrashed: false });
}

/**
 * Get user details
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User details
 */
export async function getUserDetails(userId) {
    try {
        const response = await api.get(`/users/${userId}`);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'getUserDetails failed', err);
        throw err;
    }
}

/**
 * Get file permissions
 * @param {string} fileId - File ID
 * @returns {Promise<Array>} Array of permissions
 */
export async function getPermissions(fileId) {
    try {
        const response = await api.get(`/files/${fileId}/permissions`);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        logger.error('FilesService', 'getPermissions failed', err);
        throw err;
    }
}

/**
 * Add permission to a file
 * @param {string} fileId - File ID
 * @param {string} username - Username to share with
 * @param {string} access - 'read' or 'write'
 * @returns {Promise<Object>} Permission object
 */
export async function addPermission(fileId, username, access) {
    try {
        const response = await api.post(`/files/${fileId}/permissions`, { username, access });
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Added permission for ${username} on file ${fileId}`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'addPermission failed', err);
        throw err;
    }
}

/**
 * Remove permission from a file
 * @param {string} fileId - File ID
 * @param {string} permId - Permission ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deletePermission(fileId, permId) {
    try {
        const response = await api.delete(`/files/${fileId}/permissions/${permId}`);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Removed permission ${permId} from file ${fileId}`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'deletePermission failed', err);
        throw err;
    }
}

/**
 * Share file with a user (by username)
 * @param {string} fileId - File ID
 * @param {string} username - Username to share with
 * @param {string} permission - 'view' or 'edit'
 * @returns {Promise<Object>} Permission object
 */
export async function shareFile(fileId, username, permission = 'view') {
    try {
        // Convert permission to access level for backend
        const access = permission === 'edit' ? 'write' : 'read';
        const response = await api.post(`/files/${fileId}/permissions`, { username, access });
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Shared file ${fileId} with ${username}`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'shareFile failed', err);
        throw err;
    }
}

/**
 * Get file permissions
 * @param {string} fileId - File ID
 * @returns {Promise<Array>} Array of permissions
 */
export async function getFilePermissions(fileId) {
    try {
        const response = await api.get(`/files/${fileId}/permissions`);
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        logger.error('FilesService', 'getFilePermissions failed', err);
        throw err;
    }
}

/**
 * Update permission level
 * @param {string} fileId - File ID
 * @param {string} permId - Permission ID
 * @param {string} newPermission - 'view' or 'edit'
 * @returns {Promise<Object>} Updated permission
 */
export async function updatePermission(fileId, permId, newPermission) {
    try {
        const access = newPermission === 'edit' ? 'write' : 'read';
        const response = await api.patch(`/files/${fileId}/permissions/${permId}`, { access });
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        logger.info('FilesService', `Updated permission ${permId}`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'updatePermission failed', err);
        throw err;
    }
}

/**
 * Remove permission (alias for deletePermission)
 * @param {string} fileId - File ID
 * @param {string} permId - Permission ID
 * @returns {Promise<Object>} Deletion result
 */
export async function removePermission(fileId, permId) {
    return deletePermission(fileId, permId);
}

/**
 * Upload image file using expo-image-picker
 * @param {string} name - File name
 * @param {string|null} parentId - Parent folder ID
 * @param {string} fileUri - Local file URI from image picker
 * @returns {Promise<Object>} Created file object
 */
export async function uploadImageFile(name, parentId, fileUri) {
    try {
        if (!fileUri || typeof fileUri !== 'string') {
            throw new Error('Invalid image URI');
        }

        const formData = new FormData();

        formData.append('name', name);
        formData.append('type', 'file');

        if (parentId) {
            formData.append('parentId', parentId);
        }

        formData.append('file', {
            uri: fileUri,
            name,
            type: 'image/jpeg',
        });

        const response = await api.postFormData('/files', formData);

        if (response.error) {
            throw new Error(response.error);
        }

        logger.info('FilesService', `Uploaded image: ${name}`);
        return response.data;
    } catch (err) {
        logger.error('FilesService', 'uploadImageFile failed', err);
        throw err;
    }
}



/**
 * Upload generic file (reuses uploadFile logic)
 * @param {string} name - File name
 * @param {string|null} parentId - Parent folder ID
 * @param {string} fileUri - Local file URI
 * @returns {Promise<Object>} Created file object
 */
export async function uploadGenericFile(name, parentId, fileUri) {
    // Just use the existing uploadFile function
    return uploadFile(name, parentId, fileUri);
}

/**
 * Replace image in existing file
 * @param {string} fileId - File ID to replace
 * @param {string} fileUri - New image URI
 * @returns {Promise<Object>} Updated file
 */
export async function replaceImage(fileId, fileUri) {
    try {
        const formData = new FormData();

        const filename = fileUri.split('/').pop() || 'image.jpg';

        formData.append('file', {
            uri: fileUri,
            name: filename,
            type: 'image/jpeg',
        });

        const response = await api.postFormData(
            `/files/${fileId}/image`,
            formData
        );

        if (response.error) {
            throw new Error(response.error);
        }

        return response.data;
    } catch (err) {
        logger.error('FilesService', 'replaceImage failed', err);
        throw err;
    }
}


/**
 * Copy shareable link to clipboard
 * @param {string} fileId - File ID
 * @returns {Promise<string>} Shareable URL
 */
export async function copyShareableLink(fileId) {
    try {
        // Generate shareable link (in production this would be a proper URL)
        const link = `http://localhost:3000/shared/${fileId}`;
        
        // Copy to clipboard (will be implemented with Clipboard API)
        logger.info('FilesService', `Generated link for file ${fileId}: ${link}`);
        return link;
    } catch (err) {
        logger.error('FilesService', 'copyShareableLink failed', err);
        throw err;
    }
}

/**
 * Download file to device using Sharing API
 * @param {string} fileId - File ID to download
 * @param {string} fileName - File name
 * @param {string} mimeType - File mime type
 * @returns {Promise<string>} Local file path
 */
export async function downloadFile(fileId, fileName, mimeType) {
    const FileSystem = require('expo-file-system').default;
    const Sharing = require('expo-sharing');
    
    try {
        const token = await AsyncStorage.getItem('token');
        const downloadUrl = `${getAPIBaseURL()}/files/${fileId}/download`;

        // Download to temp directory
        const fileUri = FileSystem.documentDirectory + fileName;
        const downloadResult = await FileSystem.downloadAsync(
            downloadUrl,
            fileUri,
            {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
        );

        // Share/save using native dialog
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(downloadResult.uri, {
                mimeType: mimeType || 'application/octet-stream',
                dialogTitle: `Save ${fileName}`,
                UTI: mimeType || 'public.item',
            });
            logger.info('FilesService', `File shared: ${fileName}`);
            return downloadResult.uri;
        } else {
            throw new Error('Sharing is not available on this device');
        }
    } catch (err) {
        logger.error('FilesService', 'downloadFile failed', err);
        throw err;
    }
}
