import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DrivePage from "./pages/DrivePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* App layout */}
                <Route
                    element={<AppLayout theme={theme} onToggleTheme={toggleTheme} />}
                >
                    <Route
                        path="/drive"
                        element={
                            <ProtectedRoute>
                                <DrivePage mode="drive" />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/recent"
                        element={
                            <ProtectedRoute>
                                <DrivePage mode="recent" />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/starred"
                        element={
                            <ProtectedRoute>
                                <DrivePage mode="starred" />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/shared"
                        element={
                            <ProtectedRoute>
                                <DrivePage mode="shared" />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/trash"
                        element={
                            <ProtectedRoute>
                                <DrivePage mode="trash" />
                            </ProtectedRoute>
                        }
                    />

                </Route>

                {/* Default */}
                <Route path="*" element={<Navigate to="/drive" />} />
            </Routes>
        </Router>
    );
}

export default App;
