import React, { useState, useEffect, useRef } from "react";
import { updateFileContent, replaceImage } from "../../services/filesService";
import "./drive.css";

export default function FileViewer({ file, onClose }) {
    const [content, setContent] = useState(file.content || "");
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const canEdit = file.accessLevel === "write";
    const imageInputRef = useRef(null);

    useEffect(() => {
        setContent(file.content || "");
    }, [file]);

    // 🔐 Load image with Authorization header
    useEffect(() => {
        if (!file || !file.mimeType?.startsWith("image/")) return;

        let objectUrl = null;

        const loadImage = async () => {
            try {
                const res = await fetch(`/api/files/${file.id}/download`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to load image");

                const blob = await res.blob();
                objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
            } catch (e) {
                console.error("Image load failed:", e);
                setImageUrl(null);
            }
        };

        loadImage();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [file]);

    const handleSave = async () => {
        if (!canEdit) return;
        try {
            setLoading(true);
            await updateFileContent(file.id, content);
            onClose();
        } catch {
            alert("Failed to save");
        } finally {
            setLoading(false);
        }
    };

    const handleReplaceClick = () => {
        imageInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const newFile = e.target.files[0];
        if (!newFile) return;
        try {
            setLoading(true);
            await replaceImage(file.id, newFile);
            onClose();
        } catch {
            alert("Failed to replace image");
        } finally {
            setLoading(false);
        }
    };

    const isImage = file.mimeType?.startsWith("image/");

    return (
        <div className="file-viewer-overlay" onClick={onClose}>
            <div className="file-viewer" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="file-viewer-header">
                    <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {file.name}
                        {!canEdit && (
                            <span style={{
                                fontSize: "11px",
                                background: "#eee",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                color: "#666",
                            }}>
                                Read Only
                            </span>
                        )}
                    </h3>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* Body */}
                <div className="file-viewer-body">
                    {isImage ? (
    <div style={{ textAlign: "center" }}>
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={file.name}
                                    className="file-viewer-image"
                                />
                            ) : (
                                <div style={{ padding: "40px", color: "#999" }}>
                                    Loading image...
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Text file */}
                            {file.mimeType === "text/plain" && (
                                <textarea
                                    className="file-viewer-textarea"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    readOnly={!canEdit}
                                    style={!canEdit ? { background: "#f9f9f9", color: "#555" } : {}}
                                />
                            )}

                            {/* Download for non-text files */}
                            {file.mimeType !== "text/plain" && file.filePath && (
                                <div style={{ marginTop: "16px" }}>
                                    <a
                                        href={`/api/files/${file.id}/download`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download file
                                    </a>
                                </div>
                            )}
                            {}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="file-viewer-actions">
                    {canEdit && (
                        <>
                            {isImage ? (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        ref={imageInputRef}
                                        onChange={handleImageChange}
                                    />
                                    <button onClick={handleReplaceClick} disabled={loading}>
                                        Replace Image
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleSave} disabled={loading}>
                                    Save
                                </button>
                            )}
                        </>
                    )}
                    <button className="secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
