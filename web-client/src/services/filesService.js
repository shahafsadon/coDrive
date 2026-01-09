import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

/**
 * GET files
 * - root level: GET /files
 * - folder children: GET /files/:id
 */
export async function getFiles(parentId = null) {
    const path = parentId ? `/files/${parentId}` : "/files";
    return apiGet(path);
}

/**
 * CREATE file / folder
 */
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

    return apiPost("/files", {
        name,
        type,
        parentId,
    });
}

/**
 * RENAME file / folder
 */
export async function renameFile(id, newName) {
    return apiPatch(`/files/${id}`, { name: newName });
}

/**
 * DELETE file / folder
 */
export async function deleteFile(id) {
    return apiDelete(`/files/${id}`);
}

/**
 * UPDATE file content (text file)
 */
export async function updateFileContent(id, content) {
    return apiPatch(`/files/${id}`, { content });
}

/**
 * GET single file
 */
export async function getFileById(id) {
    return apiGet(`/files/${id}`);
}

/**
 * UPLOAD image file
 */
export async function uploadImageFile(name, parentId, file) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", "file");

    if (parentId !== null) {
        formData.append("parentId", parentId);
    }

    formData.append("file", file);
    formData.append("mimeType", file.type);

    return apiPost("/files", formData);
}

export async function replaceImage(fileId, file) {
    const formData = new FormData();
    formData.append("file", file);

    return apiPatch(`/files/${fileId}/image`, formData);
}
