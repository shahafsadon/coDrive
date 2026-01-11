import React from "react";
import "./drive.css";

export default function FileCard({
    file,
    onRename,
    onDelete,
    onOpenFolder,
    onOpenFile,
    onShare,
    onMove,
    onToggleStar,
    isStarred
}) {
    const isFolder = file.type === "folder";
    const isImage = file.mimeType?.startsWith("image/");

    let icon = <span style={{ fontSize: '48px' }}>📄</span>;
    if (isFolder) {
        icon = <span style={{ fontSize: '48px' }}>📂</span>;
    } else if (isImage && file.filePath) {
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

    return (
        <div
            className="file-card"
            style={{ position: "relative" }}
            onDoubleClick={() => isFolder ? onOpenFolder(file) : onOpenFile(file)}
            title={file.name}
        >

            {/* ⭐ STAR – top right */}
            <div
                style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    fontSize: "18px",
                    cursor: "pointer",
                    userSelect: "none"
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar?.(file);
                }}
                title="Star"
            >
                {isStarred ? "⭐" : "☆"}
            </div>



            <div
                className="file-icon"
                style={{
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {icon}
            </div>

            <div className="file-name">{file.name}</div>

            <div
                className="file-actions"
                style={{
                    marginTop: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '4px'
                }}
            >
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
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#d93025' }}
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}
