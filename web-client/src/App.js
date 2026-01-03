import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DrivePage from "./pages/DrivePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";


// Main application component with routing setup
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<AppLayout />}>
                     <Route
                        path="/drive"
                        element={
                            <ProtectedRoute>
                                <DrivePage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
