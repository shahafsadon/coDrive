import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DrivePage from "./pages/DrivePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecentPage from "./pages/RecentPage";
import StarredPage from "./pages/StarredPage";
import SharedPage from "./pages/SharedPage";
import TrashPage from "./pages/TrashPage";

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
                                <DrivePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Side menu pages */}
                    <Route
                        path="/recent"
                        element={
                            <ProtectedRoute>
                                <RecentPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/starred"
                        element={
                            <ProtectedRoute>
                                <StarredPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/shared"
                        element={
                            <ProtectedRoute>
                                <SharedPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/trash"
                        element={
                            <ProtectedRoute>
                                <TrashPage />
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
