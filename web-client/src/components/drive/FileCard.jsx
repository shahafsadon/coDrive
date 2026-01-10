import React from "react";
import "./drive.css";

export default function FileCard({ file, onRename, onDelete, onOpenFolder, onOpenFile, onShare, onMove }) {
    const isFolder = file.type === "folder";
    const isImage = file.mimeType?.startsWith("image/");

    // Bigger icons logic
    let icon = <span style={{ fontSize: '48px' }}>📄</span>;
    if (isFolder) {
        icon = <span style={{ fontSize: '48px' }}>📂</span>;
    } else if (isImage && file.filePath) {
        // Preview image if available
        icon = (
            <img 
                src={`http://localhost:3000/${file.filePath.replace(/\\/g, '/')}`} 
                alt={file.name}
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px' }} 
            />
        );
    } else if (isImage) {
        icon = <span style={{ fontSize: '48px' }}>🖼️</span>;
    }

    const handleAction = (e, action) => {
        e.stopPropagation();
        action();
    };

    // Render
    return (
        <div
            className="file-card"
            onDoubleClick={() => isFolder ? onOpenFolder(file.id) : onOpenFile(file)}
            title={file.name}
        >
            <div className="file-icon" style={{ height: '70px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>

            <div className="file-name">{file.name}</div>

            <div className="file-actions" style={{ marginTop: '8px', 
                display: 'flex', justifyContent: 'center', gap: '4px' }}>
                <button 
                    title="Share"
                    onClick={(e) => handleAction(e, () => onShare(file))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                    🔗
                </button>
                <button 
                    title="Move"
                    onClick={(e) => handleAction(e, () => onMove(file))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                    ➡️
                </button>
                <button 
                    title="Rename"
                    onClick={(e) => handleAction(e, () => onRename(file.id))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                    ✏️
                </button>
                <button 
                    title="Delete"
                    onClick={(e) => handleAction(e, () => onDelete(file.id))}
                    style={{ background: 'none',border: 'none',cursor: 'pointer',fontSize: '16px', color: '#d93025' }}
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}