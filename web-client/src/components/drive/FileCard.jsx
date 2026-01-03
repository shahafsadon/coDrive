import React from "react";
import "./drive.css";

export default function FileCard({ file, onRename, onDelete }) {
    const handleRename = () => {
        const newName = prompt("Enter new file name:", file.name);
        if (newName && newName !== file.name) {
            onRename(file.id, newName);
        }
    };

    const handleDelete = () => {
        if (window.confirm(`Delete "${file.name}"?`)) {
            onDelete(file.id);
        }
    };

    return (
        <div className="file-card">
            <div className="file-icon">📄</div>

            <div className="file-name" title={file.name}>
                {file.name}
            </div>

            <div className="file-actions">
                <button className="file-action-btn" onClick={handleRename}>
                    Rename
                </button>
                <button className="file-action-btn delete" onClick={handleDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}
