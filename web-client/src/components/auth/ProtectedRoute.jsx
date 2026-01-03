import { Navigate } from "react-router-dom";

// A wrapper for protected routes
export default function ProtectedRoute({ children }) {
    // Check if user is authenticated while supporting backward compatibility
    const userId =
        localStorage.getItem("userId") ||
        localStorage.getItem("token"); // backward-safe

    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
