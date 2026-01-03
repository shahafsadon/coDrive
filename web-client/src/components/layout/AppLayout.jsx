import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";

export default function AppLayout() {
    return (
        <div className="app-layout">
            <TopBar />
            <div className="app-body">
                <SideMenu />
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
