import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import FileGrid from "../components/drive/FileGrid";
import FileViewer from "../components/drive/FileViewer";
import ShareModal from "../components/drive/ShareModal";
import {
    getFiles, searchFiles, createFile, renameFile, deleteFile, 
    getFileById, uploadImageFile, moveFile
} from "../services/filesService";
import "../components/drive/drive.css";

export default function DrivePage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [shareFile, setShareFile] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "My Drive" }]);

    const [deleteId, setDeleteId] = useState(null);

    // Input Modal State
    const [inputModal, setInputModal] = useState({ open: false, title: "", value: "", action: null, 
        showRootOption: false });
    
    const fileInputRef = useRef(null);
    const { createMode, setCreateMode, currentFolderId, setCurrentFolderId, searchTerm } = useOutletContext();
    
    // Load files
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            let data = searchTerm ? await searchFiles(searchTerm) : await getFiles(currentFolderId);
            if (Array.isArray(data)) setFiles(data);
            else if (data && Array.isArray(data.children)) setFiles(data.children);
            else setFiles([]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentFolderId, searchTerm]);

    useEffect(() => { loadData(); }, [loadData]);

    // Breadcrumbs
    useEffect(() => {
        if (searchTerm) {
            setBreadcrumbs([{ id: null, name: `Results: "${searchTerm}"` }]);
            return;
        }
        if (!currentFolderId) {
            setBreadcrumbs([{ id: null, name: "My Drive" }]);
        } else {
             setBreadcrumbs(prev => {
                const exists = prev.find(b => b.id === currentFolderId);
                return exists ? prev.slice(0, prev.indexOf(exists) + 1) : 
                [...prev, { id: currentFolderId, name: "Folder" }];
             });
        }
    }, [currentFolderId, searchTerm]);

    // Handle file/folder click
    const handleFileClick = async (file) => {
        try {
            if (file.type === "folder") {
                setCurrentFolderId(file.id);
            } else {
                if (file.mimeType === "text/plain" && !file.content) {
                     const fullFile = await getFileById(file.id);
                     setSelectedFile(fullFile);
                } else {
                     setSelectedFile(file);
                }
            }
        } catch (err) {
            alert(err.message || "Cannot open file");
        }
    };

    // Modal Actions 

    // Helper to open input modal
    const openInputModal = (title, defaultValue, action, showRootOption = false) => {
        setInputModal({ open: true, title, value: defaultValue || "", action, showRootOption });
    };

    // Handle input modal submission
    const handleInputSubmit = async () => {
        try {
            if (inputModal.action) await inputModal.action(inputModal.value);
            setInputModal({ ...inputModal, open: false });
            loadData();
        } catch (err) {
            alert(err.message); 
        }
    };
    
    // Handle move to root
    const handleMoveToRoot = async () => {
        try {
            if (inputModal.action) await inputModal.action(""); // Empty string triggers root move
            setInputModal({ ...inputModal, open: false });
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    // Handlers

    // Create new text file
    const createTextFile = () => {
        setCreateMode(false);
        openInputModal("New File Name", "", async (name) => {
            if (name) await createFile(name, "file", currentFolderId);
        });
    };

    // Create new folder
    const createFolder = () => {
        setCreateMode(false);
        openInputModal("New Folder Name", "", async (name) => {
            if (name) await createFile(name, "folder", currentFolderId);
        });
    };

    // Handle rename
    const handleRename = (id, currentName) => {
        openInputModal("Rename File", currentName, async (newName) => {
            if (newName && newName !== currentName) await renameFile(id, newName);
        });
    };

    // Handle move
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

    // Confirm Delete with Error Handling
    const confirmDelete = async () => {
        try {
            if (deleteId) {
                await deleteFile(deleteId);
                setDeleteId(null);
                loadData();
            }
        } catch (err) {
            alert(err.message);
            setDeleteId(null);
        }
    };

    // Create image file
    const createImageFile = () => fileInputRef.current.click();
    
    // Handle image file selection
    const handleImageSelected = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await uploadImageFile(file.name, currentFolderId, file);
            setCreateMode(false);
            loadData();
        } catch (err) { alert("Upload failed"); }
    };

    // Render
    return (
        <>
            <div className="breadcrumbs" style={{ padding: "10px 20px", fontSize: "18px", color: "#5f6368" }}>
                 {breadcrumbs.map((b, idx) => (
                    <span key={b.id || "root"}>
                        {idx > 0 && " > "}
                        <span 
                            style={{ cursor: "pointer", fontWeight: idx === breadcrumbs.length - 1 ? "bold" : "normal"}}
                            onClick={() => !searchTerm && setCurrentFolderId(b.id)}
                        >
                            {b.name}
                        </span>
                    </span>
                 ))}
            </div>

            {loading ? <div style={{ padding: "20px" }}>Loading...</div> : (
                <FileGrid
                    files={files}
                    onOpenFolder={setCurrentFolderId}
                    onOpenFile={handleFileClick}
                    onDelete={(id) => setDeleteId(id)}
                    onRename={(id) => { const f = files.find(x => x.id === id); handleRename(id, f?.name); }}
                    onShare={setShareFile}
                    onMove={handleMove}
                />
            )}

            {/* Modals */}
            {selectedFile && (
                <FileViewer 
                    file={selectedFile} 
                    onClose={() => { setSelectedFile(null); loadData(); }} 
                />
            )}

            {shareFile && (
                <ShareModal file={shareFile} onClose={() => setShareFile(null)} />
            )}

            {/* Input Modal */}
            {inputModal.open && (
                <div className="file-viewer-overlay">
                    <div className="create-modal" style={{ minWidth: '350px' }}>
                        <h3>{inputModal.title}</h3>
                        <input 
                            autoFocus
                            type="text" 
                            placeholder={inputModal.showRootOption ? "Enter folder name..." : ""}
                            value={inputModal.value}
                            onChange={(e) => setInputModal({...inputModal, value: e.target.value})}
                            style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '4px', 
                                border: '1px solid #ccc' }}
                            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            {inputModal.showRootOption && (
                                <button 
                                    onClick={handleMoveToRoot} 
                                    style={{ marginRight: 'auto', background: '#e8f0fe', 
                                        color: '#1a73e8', border: 'none' }}
                                    title="Move to My Drive"
                                >
                                    🏠 Move to Main
                                </button>
                            )}
                            
                            <button onClick={() => setInputModal({ ...inputModal, open: false })}>Cancel</button>
                            <button onClick={handleInputSubmit} 
                            style={{ background: '#1a73e8', color: 'white' }}>OK</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="file-viewer-overlay">
                    <div className="create-modal" style={{ minWidth: '300px' }}>
                        <h3 style={{color: '#d93025'}}>Delete Item?</h3>
                        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
                            <button onClick={() => setDeleteId(null)}>Cancel</button>
                            <button onClick={confirmDelete} 
                            style={{ background: '#d93025', color: 'white', border: 'none' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Create Menu Modal */}
             {createMode && (
                <div className="file-viewer-overlay" onClick={() => setCreateMode(false)}>
                    <div className="create-modal" onClick={e => e.stopPropagation()}>
                        <h3>Create new</h3>
                        <button onClick={createTextFile}>📄 Text file</button>
                        <button onClick={createImageFile}>🖼️ Image file</button>
                        <button onClick={createFolder}>📁 Folder</button>
                        <div style={{ marginTop: "8px" }}><button onClick={() => 
                            setCreateMode(false)}>Cancel</button></div>
                    </div>
                </div>
            )}
             <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} 
             onChange={handleImageSelected} />
        </>
    );
}