import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DrivePage from "./pages/DrivePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppLayout from "./components/layout/AppLayout";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<AppLayout />}>
                    <Route path="/drive" element={<DrivePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
