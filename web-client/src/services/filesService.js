import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

// FILES SERVICE
export async function getFiles(parentId = null) {
    const path = parentId ? `/files/${parentId}` : "/files";
    return apiGet(path);
}

// Search files by name
export async function searchFiles(query) {
    return apiGet(`/search/${encodeURIComponent(query)}`);
}

// Create a new file or folder
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

// Rename a file or folder
export async function renameFile(id, newName) {
    return apiPatch(`/files/${id}`, { name: newName });
}

// Delete a file or folder
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

// USER INFO
export async function getUserDetails(userId) {
    return apiGet(`/users/${userId}`);
}


// Replace image of existing file
export async function replaceImage(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    // Use PATCH to update existing file
    return apiPatch(`/files/${id}/image`, formData);
}