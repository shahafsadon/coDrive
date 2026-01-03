import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

export default function RegisterPage() {
    const navigate = useNavigate();

    // Form state
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    // UI state
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fileInputRef = useRef(null);

    // Validation logic
    const validate = () => {
        if (!username || !name || !password || !confirmPassword) {
            return "All fields are required";
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters";
        }

        if (!/[a-zA-Z]/.test(password)) {
            return "Password must contain at least one letter";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match";
        }

        return null;
    };

    // Image preview only (NOT sent to server)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await register({
                username,
                password,
                name// REQUIRED by EX4 backend
                // Note: image upload not implemented 
            });

            setSuccess("Registration successful. Please login.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            console.error("REGISTER ERROR:", err.message);
            setError(err.message || "Registration failed");
        } 
        };

    // Render component
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Register</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Display name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />

                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="preview"
                            style={{ width: "90px", marginTop: "10px", borderRadius: "8px" }}
                        />
                    )}

                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}

                    <button type="submit">Register</button>

                    <p style={{ marginTop: "12px", textAlign: "center" }}>
                        Already have an account?{" "}
                        <span
                            style={{ color: "#2563eb", cursor: "pointer" }}
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
