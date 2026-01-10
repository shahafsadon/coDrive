import React from "react";
import "./TopBar.css";

// TopBar Component
export default function TopBar({ 
    onNewFile, 
    onLogout, 
    theme, 
    onToggleTheme, 
    user, 
    searchTerm, 
    onSearchChange 
}) {
    // Determine display name and profile picture
    const displayName = user?.fullName || localStorage.getItem("username") || "User";
    const profilePic = user?.image; 

    // Render TopBar
    return (
        <header className="topbar">
            <div className="topbar-left">
                <div className="logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginRight: "8px" }}>
                        <polygon points="12,2 22,12 12,22 2,12" fill="#1a73e8" />
                        <polygon points="12,6 18,12 12,18 6,12" fill="#34a853" />
                    </svg>
                    <span>coDrive</span>
                </div>

                <button className="new-btn" onClick={onNewFile}>
                    ➕ New
                </button>
            </div>

            <div className="topbar-search">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search in Drive"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="topbar-right">
                {}
                <button
                    className="theme-toggle-btn"
                    onClick={onToggleTheme}
                    title="Toggle theme"
                    style={{ width: "auto", minWidth: "120px", justifyContent: "center" }} 
                >
                    {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>

                <div className="user-info">
                    <div className="user-avatar">
                        {profilePic ? (
                            <img src={profilePic} alt="Profile" />
                        ) : (
                            <span>{displayName.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    
                    <button className="logout-btn" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}