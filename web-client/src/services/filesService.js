import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

// FILES SERVICE
export async function getFiles(parentId = null) {
    const path = parentId ? `/files/${parentId}` : "/files";
    return apiGet(path);
}

// Search files by query
export async function searchFiles(query) {
    return apiGet(`/search/${encodeURIComponent(query)}`);
}

// Create file or folder
export async function createFile(name, type, parentId = null) {
    if (type === "file") {
        return apiPost("/files", {
            name,
            type,
            parentId,
            content: "",
            mimeType: "text/plain",
        });
    }
    return apiPost("/files", { name, type, parentId });
}

// Rename file or folder
export async function renameFile(id, newName) {
    return apiPatch(`/files/${id}`, { name: newName });
}

// Move file or folder
export async function moveFile(id, parentName) {
    return apiPatch(`/files/${id}`, { parentName });
}

// Delete file or folder
export async function deleteFile(id) {
    return apiDelete(`/files/${id}`);
}

// Update file content
export async function updateFileContent(id, content) {
    return apiPatch(`/files/${id}`, { content });
}

// Get file by ID
export async function getFileById(id) {
    return apiGet(`/files/${id}`);
}

// Upload image file
export async function uploadImageFile(name, parentId, file) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", "file");
    if (parentId !== null) formData.append("parentId", parentId);
    formData.append("file", file);

    return apiPost("/files", formData);
}

// USERS SERVICE
export async function getUserDetails(userId) {
    return apiGet(`/users/${userId}`);
}

// IMAGE REPLACEMENT SERVICE
export async function replaceImage(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    return apiPatch(`/files/${id}/image`, formData);
}

// PERMISSIONS SERVICE
export async function getPermissions(fileId) {
    return apiGet(`/files/${fileId}/permissions`);
}

// Add permission
export async function addPermission(fileId, username, access) {
    return apiPost(`/files/${fileId}/permissions`, { username, access });
}

// Delete permission
export async function deletePermission(fileId, permId) {
    return apiDelete(`/files/${fileId}/permissions/${permId}`);
}

// Update permission
export const updateFile = (id, data) =>
    apiPatch(`/files/${id}`, data);


export async function deleteFilePermanent(id) {
    return apiDelete(`/files/${id}/permanent`);
}
