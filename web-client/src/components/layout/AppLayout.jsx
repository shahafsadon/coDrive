import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";
import { getUserDetails } from "../../services/filesService";

export default function AppLayout({ theme, onToggleTheme }) {
    const navigate = useNavigate();
    
    // State for Global Actions
    const [createMode, setCreateMode] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    
    // State for Search
    const [searchTerm, setSearchTerm] = useState("");

    // State for User Profile
    const [user, setUser] = useState(null);

    // Fetch user details (including image) on mount
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        getUserDetails(userId)
            .then(userData => {
                setUser(userData);
            })
            .catch(err => console.error("Failed to load user info", err));
    }, []);

    // Handlers
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleNewClick = () => {
        setCreateMode(true);
    };

    return (
        <div className="app-layout">
            <TopBar
                onNewFile={handleNewClick}
                onLogout={handleLogout}
                theme={theme}
                onToggleTheme={onToggleTheme}
                user={user} 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
            />

            <div className="app-body">
                <SideMenu />

                <main className="app-content" role="main">
                    {}
                    <Outlet
                        context={{
                            createMode,
                            setCreateMode,
                            currentFolderId,
                            setCurrentFolderId,
                            searchTerm 
                        }}
                    />
                </main>
            </div>
        </div>
    );
}