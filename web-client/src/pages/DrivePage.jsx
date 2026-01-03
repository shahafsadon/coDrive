import React, { useEffect, useState } from "react";
import {
    getFiles,
    createFile,
    renameFile,
    deleteFile,
} from "../services/filesService";
import FileGrid from "../components/drive/FileGrid";

export default function DrivePage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const data = await getFiles();
            setFiles(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load files");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();

        window.createFileInDrive = async (name) => {
            try {
                await createFile(name);
                await loadFiles();
            } catch (err) {
                alert("Failed to create file");
            }
        };

        return () => {
            delete window.createFileInDrive;
        };
    }, []);

    const handleRename = async (id, newName) => {
        try {
            await renameFile(id, newName);
            await loadFiles();
        } catch {
            alert("Failed to rename file");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteFile(id);
            await loadFiles();
        } catch {
            alert("Failed to delete file");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <FileGrid
            files={files}
            onRename={handleRename}
            onDelete={handleDelete}
        />
    );
}
