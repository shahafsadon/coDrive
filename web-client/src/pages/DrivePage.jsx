import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import FileGrid from "../components/drive/FileGrid";
import FileViewer from "../components/drive/FileViewer";
import ShareModal from "../components/drive/ShareModal";
import {
    getFiles, searchFiles, createFile, renameFile, getFileById,
    uploadImageFile, moveFile ,updateFile, restoreFromTrash, deleteFilePermanent
} from "../services/filesService";
import "../components/drive/drive.css";

export default function DrivePage({ mode }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [shareFile, setShareFile] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "My Drive" }]);
    const [deleteId, setDeleteId] = useState(null);
    const [restoreId, setRestoreId] = useState(null);

    const [inputModal, setInputModal] = useState({
        open: false,
        title: "",
        value: "",
        action: null,
        showRootOption: false
    });
    
    const fileInputRef = useRef(null);
    const { createMode, setCreateMode, currentFolderId, setCurrentFolderId, searchTerm } =
        useOutletContext();

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const path = window.location.pathname;

            let data;

            // Fetch base data
            if (searchTerm) {
                data = await searchFiles(searchTerm);
            } else {
                // Always load from root / current folder
                data = await getFiles(currentFolderId);
            }

            let filesList = [];
            if (Array.isArray(data)) {
                filesList = data;
            } else if (data && Array.isArray(data.children)) {
                filesList = data.children;
            }

            /* =========================
            FILTER BY PAGE
            ========================= */

            // Shared
            if (path === "/shared") {
                filesList = filesList.filter(
                    f => Array.isArray(f.permissions) && f.permissions.length > 0
                );
            }

            /* =========================
            SORTING
            ========================= */

            // My Drive – A → Z
            if (path === "/drive") {
                filesList = [...filesList].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            }

            // Recent – newest first (left top)
            if (path === "/recent") {
                filesList = [...filesList].reverse();
            }

            if (path === "/trash") {
                filesList = filesList.filter(f => f.isTrashed);
            } else {
                filesList = filesList.filter(f => !f.isTrashed);
            }

            if (path === "/starred") {
                filesList = filesList.filter(f => f.isStarred);
            }


            // Shared – files that have permissions (shared with me)
            if (mode === "shared") {
                filesList = filesList.filter(
                    f => Array.isArray(f.permissions) && f.permissions.length > 0
                );
            }


            setFiles(filesList);
        } catch (err) {
            console.error(err);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    }, [currentFolderId, mode]);

useEffect(() => {
    loadData();
}, [loadData]);


    // Breadcrumbs
    useEffect(() => {
        if (searchTerm) {
            setBreadcrumbs([{ id: null, name: `Results: "${searchTerm}"` }]);
        }
    }, [searchTerm]);


    // Handle file/folder click
    const handleFileClick = async (file) => {
        try {
            if (file.type === "folder") {
                enterFolder(file);
                return;
            }

            if (file.mimeType === "text/plain" && !file.content) {
                const fullFile = await getFileById(file.id);
                setSelectedFile(fullFile);
            } else {
                setSelectedFile(file);
            }
        } catch (err) {
            alert(err.message || "Cannot open file");
        }
    };


    // Helper to open input modal
    const openInputModal = (title, defaultValue, action, showRootOption = false) => {
        setInputModal({ open: true, title, value: defaultValue || "", action, showRootOption });
    };

    const handleInputSubmit = async () => {
        try {
            if (inputModal.action) await inputModal.action(inputModal.value);
            setInputModal({ ...inputModal, open: false });
            loadData();
        } catch (err) {
            alert(err.message); 
        }
    };

    const handleMoveToRoot = async () => {
        try {
            if (inputModal.action) await inputModal.action("");
            setInputModal({ ...inputModal, open: false });
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const createTextFile = () => {
        setCreateMode(false);
        openInputModal("New File Name", "", async (name) => {
            if (name) await createFile(name, "file", currentFolderId);
        });
    };

    const createFolder = () => {
        setCreateMode(false);
        openInputModal("New Folder Name", "", async (name) => {
            if (name) await createFile(name, "folder", currentFolderId);
        });
    };

    const handleRename = (id, currentName) => {
        openInputModal("Rename File", currentName, async (newName) => {
            if (newName && newName !== currentName) await renameFile(id, newName);
        });
    };

    const handleMove = (file) => {
        openInputModal(
            "Move to Folder Name",
            "",
            async (targetName) => {
                await moveFile(file.id, targetName);
            },
            true
        );
    };


    const confirmDelete = async () => {
        try {
            if (!deleteId) return;

            if (mode === "trash") {
                await deleteFilePermanent(deleteId);
            } else {
                // soft delete
                const file = files.find(f => f.id === deleteId);
                if (file) {
                    await updateFile(file.id, { isTrashed: true });
                }
            }

            setDeleteId(null);
            loadData();
        } catch (err) {
            alert(err.message);
            setDeleteId(null);
        }
    };


    const createImageFile = () => fileInputRef.current.click();

    const handleImageSelected = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await uploadImageFile(file.name, currentFolderId, file);
            setCreateMode(false);
            loadData();
        } catch {
            alert("Upload failed");
        }
    };

    const enterFolder = (folder) => {
        setCurrentFolderId(folder.id);
        setBreadcrumbs(prev => {
            const exists = prev.find(b => b.id === folder.id);
            if (exists) {
                return prev.slice(0, prev.indexOf(exists) + 1);
            }
            return [...prev, { id: folder.id, name: folder.name }];
        });
    };

    // Render
    return (
        <>
            <div className="breadcrumbs" style={{ padding: "10px 20px", fontSize: "18px" }}>
                {breadcrumbs.map((b, idx) => (
                    <span key={b.id || "root"}>
                        {idx > 0 && " > "}
                        <span
                            className={idx === breadcrumbs.length - 1 ? "breadcrumb-active" : ""}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                if (!searchTerm) {
                                    setCurrentFolderId(b.id);
                                    setBreadcrumbs(prev => prev.slice(0, idx + 1));
                                }
                            }}
                        >
                            {b.name}
                        </span>
                    </span>
                ))}
            </div>

            {loading ? (
                <div style={{ padding: "20px" }}>Loading...</div>
            ) : (
                <FileGrid
                    files={files}
                    onOpenFolder={enterFolder}
                    onOpenFile={handleFileClick}
                    onDelete={(id) => setDeleteId(id)}
                    onRename={(id) => {
                        const f = files.find(x => x.id === id);
                        handleRename(id, f?.name);
                    }}
                    onShare={setShareFile}
                    onMove={handleMove}
                    onToggleStar={async (file) => {
                        await updateFile(file.id, { isStarred: !file.isStarred });
                        loadData();
                    }}
                    onRestore={(id) => setRestoreId(id)}
                    mode={mode}
                />
            )}

            {selectedFile && (
                <FileViewer
                    file={selectedFile}
                    onClose={() => {
                        setSelectedFile(null);
                        loadData();
                    }}
                />
            )}

            {shareFile && (
                <ShareModal file={shareFile} onClose={() => setShareFile(null)} />
            )}

            {inputModal.open && (
                <div className="file-viewer-overlay">
                    <div className="create-modal" style={{ minWidth: "350px" }}>
                        <h3>{inputModal.title}</h3>
                        <input
                            autoFocus
                            type="text"
                            value={inputModal.value}
                            onChange={(e) =>
                                setInputModal({ ...inputModal, value: e.target.value })
                            }
                            onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            {inputModal.showRootOption && (
                                <button onClick={handleMoveToRoot}>🏠 Move to Main</button>
                            )}
                            <button onClick={() => setInputModal({ ...inputModal, open: false })}>
                                Cancel
                            </button>
                            <button onClick={handleInputSubmit}>OK</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="file-viewer-overlay">
                    <div className="create-modal">

                        {mode === "trash" ? (
                            <>
                                <h3>Delete forever?</h3>
                                <p>This action cannot be undone.</p>
                                <button onClick={() => setDeleteId(null)}>Cancel</button>
                                <button onClick={confirmDelete}>Delete forever</button>
                            </>
                        ) : (
                            <>
                                <h3>Move item to Trash?</h3>
                                <p>You can restore this item later from Trash.</p>
                                <button onClick={() => setDeleteId(null)}>Cancel</button>
                                <button onClick={confirmDelete}>Move to Trash</button>
                            </>
                        )}

                    </div>
                </div>
            )}
            {restoreId && (
                <div className="file-viewer-overlay">
                    <div className="create-modal">
                        <h3>Restore this item?</h3>
                        <p>The item will be returned to its original location.</p>
                        <button onClick={() => setRestoreId(null)}>Cancel</button>
                        <button
                            onClick={async () => {
                                await updateFile(restoreId, {isTrashed: false});
                                setRestoreId(null);
                                loadData();
                            }}
                        >
                            Restore
                        </button>
                    </div>
                </div>
            )}

            {createMode && (
                <div className="file-viewer-overlay" onClick={() => setCreateMode(false)}>
                    <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Create new</h3>
                        <button onClick={createTextFile}>📄 Text file</button>
                        <button onClick={createImageFile}>🖼️ Image file</button>
                        <button onClick={createFolder}>📁 Folder</button>
                        <button onClick={() => setCreateMode(false)}>Cancel</button>
                    </div>
                </div>
            )}

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
