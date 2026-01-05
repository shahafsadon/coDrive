import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import FileGrid from "../components/drive/FileGrid";
import { getFiles, createFile } from "../services/filesService";

export default function DrivePage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    // מגיע מ-AppLayout
    const { createMode, setCreateMode } = useOutletContext();

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const data = await getFiles();
            setFiles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load files", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (uiType) => {
        const name = prompt(`Enter ${uiType} name`);
        if (!name) {
            setCreateMode(false);
            return;
        }

        try {
            await createFile(name, uiType);
            await loadFiles();
        } catch (err) {
            console.error("Failed to create item", err);
            alert("Failed to create item");
        } finally {
            setCreateMode(false);
        }
    };

    return (
        <>
            {loading && <div>Loading...</div>}

            {!loading && <FileGrid files={files} />}

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
                    <button onClick={() => handleCreate("file")}>📄 File</button>
                    <button onClick={() => handleCreate("folder")}>📁 Folder</button>
                    <div style={{ marginTop: "8px" }}>
                        <button onClick={() => setCreateMode(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
