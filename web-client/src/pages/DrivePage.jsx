import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import FileGrid from "../components/drive/FileGrid";
import FileViewer from "../components/drive/FileViewer";
import {
    getFiles,
    searchFiles, 
    createFile,
    renameFile,
    deleteFile,
    getFileById,
    uploadImageFile
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
        setCurrentFolderId,
        searchTerm 
    } = useOutletContext();

    // Load files based on current folder or search term
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            let data;
            
            if (searchTerm && searchTerm.trim().length > 0) {
                // Search mode
                data = await searchFiles(searchTerm);
            } else {
                // Normal mode (navigation)
                data = await getFiles(currentFolderId);
            }

            // Normalization of data structure
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
    }, [currentFolderId, searchTerm]); 

    // Reload data when folder changes or search term changes
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Handle breadcrumbs only when NOT searching
    useEffect(() => {
        if (searchTerm) {
            setBreadcrumbs([{ id: null, name: `Search results for: "${searchTerm}"` }]);
            return;
        }
        
        // Logic to build breadcrumbs based on currentFolderId
        if (!currentFolderId) {
            setBreadcrumbs([{ id: null, name: "My Drive" }]);
        } else {
            // In a real app, we would fetch the folder details to get its name
            // For now, we simplify or assume we pushed breadcrumbs on navigation
             setBreadcrumbs(prev => {
                const exists = prev.find(b => b.id === currentFolderId);
                if (exists) {
                    const index = prev.indexOf(exists);
                    return prev.slice(0, index + 1);
                }
                return [...prev, { id: currentFolderId, name: "Folder" }];
             });
        }
    }, [currentFolderId, searchTerm]);

    
    const handleFolderClick = (folderId) => {
        if (searchTerm) {
            // If searching, reset to folder and clear search
            setCurrentFolderId(folderId);
            // Assuming there's a way to clear search in the context
        } else {
            setCurrentFolderId(folderId);
        }
    };

    const handleFileClick = async (file) => {
        if (file.type === "folder") {
            handleFolderClick(file.id);
        } else {
            // if it's a text file without content, fetch full details
            if (file.mimeType === "text/plain" && !file.content) {
                 const fullFile = await getFileById(file.id);
                 setSelectedFile(fullFile);
            } else {
                 setSelectedFile(file);
            }
        }
    };
    
    // Create Handlers
    const createTextFile = async () => {
        const name = prompt("Enter file name:");
        if (name) {
            await createFile(name, "file", currentFolderId);
            setCreateMode(false);
            loadData();
        }
    };

    // Create Folder Handler
    const createFolder = async () => {
        const name = prompt("Enter folder name:");
        if (name) {
            await createFile(name, "folder", currentFolderId);
            setCreateMode(false);
            loadData();
        }
    };

    // Create Image File Handler
    const createImageFile = () => {
        fileInputRef.current.click();
    };

    // Handle Image Selection and Upload
    const handleImageSelected = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await uploadImageFile(file.name, currentFolderId, file);
            setCreateMode(false);
            loadData();
        } catch (err) {
            alert("Upload failed");
        }
    };
    
    // ...Rename / Delete handlers...

    return (
        <>
            {/* Breadcrumbs */}
            <div className="breadcrumbs" style={{ padding: "10px 20px", fontSize: "18px", color: "#5f6368" }}>
                 {breadcrumbs.map((b, idx) => (
                    <span key={b.id || "root"}>
                        {idx > 0 && " > "}
                        <span 
                            style={{ cursor: "pointer", color: idx === 
                                breadcrumbs.length - 1 ? "#202124" : "inherit" }}
                            onClick={() => !searchTerm && setCurrentFolderId(b.id)}
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
                    onOpenFolder={(id) => handleFolderClick(id)}
                    onOpenFile={(file) => handleFileClick(file)}
                    onDelete={async (id) => { await deleteFile(id); loadData(); }}
                    onRename={async (id, newName) => { await renameFile(id, newName); loadData(); }}
                />
            )}

            {selectedFile && (
                <FileViewer
                    file={selectedFile}
                    onClose={() => { setSelectedFile(null); loadData(); }}
                />
            )}

            {/* Modal for creating files */}
             {createMode && (
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                background: "#fff", padding: "16px", border: "1px solid #ccc", borderRadius: "8px",zIndex: 1000 }}>
                    <h3>Create new</h3>
                    <button onClick={createTextFile}>📄 Text file</button>
                    <button onClick={createImageFile}>🖼️ Image file</button>
                    <button onClick={createFolder}>📁 Folder</button>
                    <div style={{ marginTop: "8px" }}><button onClick={() => setCreateMode(false)}>Cancel</button></div>
                </div>
            )}
             <input type="file" accept="image/*" 
             ref={fileInputRef} style={{ display: "none" }} onChange={handleImageSelected} />
        </>
    );
}