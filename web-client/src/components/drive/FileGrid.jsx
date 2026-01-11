import React from "react";
import FileCard from "./FileCard";
import "./drive.css";

export default function FileGrid({
                                     files,
                                     onRename,
                                     onDelete,
                                     onOpenFolder,
                                     onOpenFile,
                                     onShare, 
                                     onMove, 
                                 }) {
    if (!files || files.length === 0) {
        return (
            <div className="empty-state" role="status">
                No files found
            </div>
        );
    }

    return (
        <div className="file-grid">
            {files.map((file) => (
                <FileCard
                    key={file.id}
                    file={file}
                    onRename={onRename}
                    onDelete={onDelete}
                    onOpenFolder={onOpenFolder}
                    onOpenFile={onOpenFile}
                    onShare={onShare} 
                    onMove={onMove}  
                />
            ))}
        </div>
    );
}