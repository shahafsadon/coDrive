import React from "react";
import "./drive.css";

export default function FileCard({
                                     file,
                                     onRename,
                                     onDelete,
                                     onOpenFolder,
                                     onOpenFile
                                 }) {
    const isFolder = file.type === "folder";
    const isImage =
        file.mimeType?.startsWith("image/") || Boolean(file.filePath);

    let icon = "📄";
    if (isFolder) {
        icon = "📁";
    } else if (isImage) {
        icon = "🖼️";
    }

    const handleRename = (e) => {
        e.stopPropagation();
        const newName = prompt("Enter new file name:", file.name);
        if (newName && newName !== file.name) {
            onRename(file.id, newName);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Delete "${file.name}"?`)) {
            onDelete(file.id);
        }
    };

    const handleOpen = () => {
        if (isFolder && onOpenFolder) {
            onOpenFolder(file.id, file.name);
        }

        if (!isFolder && onOpenFile) {
            onOpenFile(file);
        }
    };

    return (
        <div
            className={`file-card ${isFolder ? "folder" : "file"}`}
            onDoubleClick={handleOpen}
            role="button"
            tabIndex={0}
            aria-label={isFolder ? "Open folder" : "Open file"}
        >
            <div className="file-icon">{icon}</div>

            <div className="file-name" title={file.name}>
                {file.name}
            </div>

            <div className="file-actions">
                <button
                    className="file-action-btn"
                    onClick={handleRename}
                    aria-label="Rename file"
                >
                    Rename
                </button>

                <button
                    className="file-action-btn delete"
                    onClick={handleDelete}
                    aria-label="Delete file"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
