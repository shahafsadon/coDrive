import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DrivePage from "./pages/DrivePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const THEME_KEY = "theme";

// Main application component with routing setup
export default function App() {
    const [theme, setTheme] = useState("light");

    // Load theme on first render
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const initialTheme = savedTheme === "dark" ? "dark" : "light";
        setTheme(initialTheme);
        document.body.className = initialTheme;
    }, []);

    // Toggle between light and dark
    const toggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        document.body.className = nextTheme;
        localStorage.setItem(THEME_KEY, nextTheme);
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    element={
                        <AppLayout
                            theme={theme}
                            onToggleTheme={toggleTheme}
                        />
                    }
                >
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
