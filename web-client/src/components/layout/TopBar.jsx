import React, { useState } from "react";
import "./TopBar.css";

export default function TopBar({ onNewFile, onLogout }) {
    const username = localStorage.getItem("username");
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <header className="topbar">
            <div className="topbar-left">
                <div className="logo">
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        style={{ marginRight: "8px" }}
                    >
                        <polygon
                            points="12,2 22,12 12,22 2,12"
                            fill="#1a73e8"
                        />
                        <polygon
                            points="12,6 18,12 12,18 6,12"
                            fill="#34a853"
                        />
                    </svg>
                    <span>coDrive</span>
                </div>

                <button
                    className="new-btn"
                    onClick={onNewFile}
                >
                    ➕ New
                </button>
            </div>

            <div className="topbar-search">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search in Drive"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        console.log("Searching:", e.target.value);
                    }}
                />
            </div>

            <div className="topbar-right">
                <div className="user-info">
                    <span className="user-email">👤 {username}</span>
                    <button className="logout-btn" onClick={onLogout}>
                        🚪 Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
