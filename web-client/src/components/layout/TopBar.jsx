import React from "react";
import "./TopBar.css";

export default function TopBar() {
    return (
        <header className="top-bar">
            <div className="logo">coDrive</div>

            <button
                className="new-btn"
                onClick={() => {
                    const name = prompt("Enter file name");
                    if (name && window.createFileInDrive) {
                        window.createFileInDrive(name);
                    }
                }}
            >
                + New
            </button>

            <div className="top-bar-right">
                <span>user@email.com</span>
                <button className="logout-btn">Logout</button>
            </div>
        </header>
    );
}
