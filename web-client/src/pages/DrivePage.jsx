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
            setError(null);
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

        // Expose create action to TopBar
        window.createFileInDrive = async () => {
            const isFolder = window.confirm(
                "Create folder?\nOK = Folder, Cancel = File"
            );

            const type = isFolder ? "folder" : "file";
            const name = prompt(`Enter ${type} name`);

            if (!name) return;

            try {
                await createFile(name, type);
                await loadFiles();
            } catch (err) {
                console.error(err);
                alert("Failed to create " + type);
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
        } catch (err) {
            console.error(err);
            alert("Failed to rename item");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            await deleteFile(id);
            await loadFiles();
        } catch (err) {
            console.error(err);
            alert("Failed to delete item");
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
