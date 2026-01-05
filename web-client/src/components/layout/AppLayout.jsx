import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";

export default function AppLayout() {
    const navigate = useNavigate();
    const [createMode, setCreateMode] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
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
            />

            <div className="app-body">
                <SideMenu />
                <main className="app-content">
                    <Outlet context={{ createMode, setCreateMode }} />
                </main>
            </div>
        </div>
    );
}
