import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";

// Layout component that includes TopBar, SideMenu, and an Outlet for nested routes
export default function AppLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Render the layout with TopBar, SideMenu, and main content area
    return (
        <div className="app-layout">
            <TopBar onLogout={handleLogout} />
            <div className="app-body">
                <SideMenu />
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
