import React from "react";
import FileCard from "./FileCard";
import "./drive.css";

export default function FileGrid({ files, onRename, onDelete }) {
    if (!files || files.length === 0) {
        return <div className="empty-state">No files found</div>;
    }

    return (
        <div
            className="file-grid"
            style={{
                alignItems: "flex-start",
                justifyContent: "flex-start",
                paddingTop: "24px"
            }}
        >
            {files.map((file) => (
                <FileCard
                    key={file.id}
                    file={file}
                    onRename={onRename}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
