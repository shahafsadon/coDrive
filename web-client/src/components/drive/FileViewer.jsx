import React, { useEffect, useRef, useState } from "react";
import {
    updateFileContent,
    replaceImage
} from "../../services/filesService";

function FileViewer({ file, onClose }) {
    const isText =
        file.mimeType?.startsWith("text") ||
        typeof file.content === "string";

    const isImage = file.mimeType?.startsWith("image");

    const [content, setContent] = useState(file.content || "");
    const [saving, setSaving] = useState(false);

    const [imageUrl, setImageUrl] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);

    const fileInputRef = useRef(null);

    /* ---------- LOAD IMAGE (AUTH SAFE) ---------- */
    useEffect(() => {
        if (!isImage) return;

        let objectUrl;

        const loadImage = async () => {
            try {
                setLoadingImage(true);
                const token = localStorage.getItem("token");

                const res = await fetch(
                    `/api/files/${file.id}/download`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to load image");
                }

                const blob = await res.blob();
                objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingImage(false);
            }
        };

        loadImage();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [file.id, isImage]);

    /* ---------- SAVE TEXT FILE ---------- */
    const handleSave = async () => {
        try {
            setSaving(true);
            await updateFileContent(file.id, content);
            alert("Saved successfully");
        } catch {
            alert("Failed to save file");
        } finally {
            setSaving(false);
        }
    };

    /* ---------- REPLACE IMAGE (CORRECT WAY) ---------- */
    const handleReplaceImage = async (e) => {
        const newFile = e.target.files[0];
        if (!newFile) return;

        try {
            await replaceImage(file.id, newFile);
            onClose();
        } catch (err) {
            alert("Failed to replace image");
        } finally {
            e.target.value = null;
        }
    };

    return (
        <div className="file-viewer-overlay">
            <div className="file-viewer">
                <div className="file-viewer-header">
                    <h3>{file.name}</h3>
                    <button onClick={onClose}>✖</button>
                </div>

                {/* ---------- TEXT FILE ---------- */}
                {isText && (
                    <>
                        <textarea
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                            className="file-viewer-textarea"
                        />

                        <div className="file-viewer-actions">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </>
                )}

                {/* ---------- IMAGE FILE ---------- */}
                {isImage && (
                    <>
                        {loadingImage && (
                            <div className="file-viewer-loading">
                                Loading image…
                            </div>
                        )}

                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={file.name}
                                className="file-viewer-image"
                            />
                        )}

                        <div className="file-viewer-actions">
                            <button
                                onClick={() =>
                                    fileInputRef.current.click()
                                }
                            >
                                🔁 Replace image
                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleReplaceImage}
                            />
                        </div>
                    </>
                )}

                {!isText && !isImage && (
                    <div>No preview available</div>
                )}
            </div>
        </div>
    );
}

export default FileViewer;
