import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

export async function getFiles() {
    return await apiGet("/files");
}

export async function createFile(name) {
    return await apiPost("/files", { name });
}

export async function renameFile(id, newName) {
    return await apiPatch(`/files/${id}`, { name: newName });
}

export async function deleteFile(id) {
    return await apiDelete(`/files/${id}`);
}
