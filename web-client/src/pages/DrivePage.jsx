import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { uploadImageFile } from "../services/filesService";
import FileGrid from "../components/drive/FileGrid";
import FileViewer from "../components/drive/FileViewer";
import {
    getFiles,
    createFile,
    renameFile,
    deleteFile,
    getFileById
} from "../services/filesService";

export default function DrivePage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([
        { id: null, name: "My Drive" }
    ]);

    const fileInputRef = useRef(null);

    const {
        createMode,
        setCreateMode,
        currentFolderId,
        setCurrentFolderId
    } = useOutletContext();

    const loadFiles = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getFiles(currentFolderId);

            if (Array.isArray(data)) {
                setFiles(data);
            } else if (data && Array.isArray(data.children)) {
                setFiles(data.children);
            } else {
                setFiles([]);
            }
        } catch (err) {
            console.error("Failed to load files", err);
        } finally {
            setLoading(false);
        }
    }, [currentFolderId]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    /* ---------- CREATE ---------- */

    const createTextFile = async () => {
        const name = prompt("Enter text file name");
        if (!name) return;

        const nameExists = files.some(f => f.name === name);
        if (nameExists) {
            alert("An item with this name already exists in this folder");
            return;
        }

        try {
            await createFile(name, "file", currentFolderId);
            await loadFiles();
        } catch (err) {
            alert("Failed to create text file");
        } finally {
            setCreateMode(false);
        }
    };

    const createImageFile = () => {
        fileInputRef.current?.click();
    };

    const handleImageSelected = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const name = prompt("Enter image name", file.name);
        if (!name) return;

        try {
            await uploadImageFile(name, currentFolderId, file);
            await loadFiles();
        } catch (err) {
            alert("Failed to upload image");
        } finally {
            e.target.value = null;
            setCreateMode(false);
        }
    };


    const createFolder = async () => {
        const name = prompt("Enter folder name");
        if (!name) return;

        const nameExists = files.some(f => f.name === name);
        if (nameExists) {
            alert("An item with this name already exists in this folder");
            return;
        }

        try {
            await createFile(name, "folder", currentFolderId);
            await loadFiles();
        } catch (err) {
            alert("Failed to create folder");
        } finally {
            setCreateMode(false);
        }
    };

    /* ---------- ACTIONS ---------- */

    const handleRename = async (id, newName) => {
        try {
            await renameFile(id, newName);
            await loadFiles();
        } catch (err) {
            alert("Failed to rename item");
        }
    };

    const handleDelete = async (id) => {
        const ok = window.confirm(
            "This will delete the item and all its contents. Continue?"
        );
        if (!ok) return;

        try {
            await deleteFile(id);
            await loadFiles();
        } catch (err) {
            alert("Failed to delete item");
        }
    };

    const handleOpenFolder = (folderId, folderName) => {
        setCurrentFolderId(folderId);
        setBreadcrumbs((prev) => {
            const existingIndex = prev.findIndex(b => b.id === folderId);
            if (existingIndex !== -1) {
                return prev.slice(0, existingIndex + 1);
            }
            return [...prev, { id: folderId, name: folderName }];
        });
    };

    const handleOpenFile = async (file) => {
        try {
            const fullFile = await getFileById(file.id);
            setSelectedFile(fullFile);
        } catch (err) {
            alert("Failed to open file");
        }
    };

    const handleBreadcrumbClick = (index) => {
        const crumb = breadcrumbs[index];
        setCurrentFolderId(crumb.id);
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    };

    return (
        <>
            {/* Breadcrumbs */}
            <div className="breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="breadcrumb-item">
            <span
                className={
                    index === breadcrumbs.length - 1
                        ? "breadcrumb-current"
                        : "breadcrumb-link"
                }
                onClick={() => handleBreadcrumbClick(index)}
            >
                {crumb.name}
            </span>

                        {index < breadcrumbs.length - 1 && (
                            <span className="separator"> / </span>
                        )}
        </span>
                ))}
            </div>


            {loading && <div>Loading...</div>}

            {!loading && (
                <FileGrid
                    files={files}
                    onRename={handleRename}
                    onDelete={handleDelete}
                    onOpenFolder={handleOpenFolder}
                    onOpenFile={handleOpenFile}
                />
            )}

            {selectedFile && (
                <FileViewer
                    file={selectedFile}
                    onClose={() => {
                        setSelectedFile(null);
                        loadFiles();
                    }}
                />

            )}

            {createMode && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "#fff",
                        padding: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        zIndex: 1000
                    }}
                >
                    <h3>Create new</h3>

                    <button onClick={createTextFile}>📄 Text file</button>
                    <button onClick={createImageFile}>🖼️ Image file</button>
                    <button onClick={createFolder}>📁 Folder</button>

                    <div style={{ marginTop: "8px" }}>
                        <button onClick={() => setCreateMode(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Hidden image input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageSelected}
            />
        </>
    );
}
