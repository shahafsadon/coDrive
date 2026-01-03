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
    const [image, setImage] = useState(null);

    // UI state
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fileInputRef = useRef();

    // Validation: returns error message or null if valid
    const validate = () => {
        if (!username || !name || !password || !confirmPassword) {
            return "All fields are required";
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match";
        }

        return null;
    };

    // Handlers: Event handlers
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
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
                name,
                image,
            });

            setSuccess("Registration successful. Please login.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            // Backend sends text error
            if (err.message.includes("Username already exists")) {
                setError("Username already exists");
            } else {
                setError("Registration failed");
            }
        }
    };

    // Render component 
    return (
        <div className="register-page">
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

                {image && (
                    <div>
                        <img
                            src={image}
                            alt="preview"
                            style={{ width: "100px", marginTop: "10px" }}
                        />
                    </div>
                )}

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                
                <button type="submit">Register</button>
                {/* Extra navigation link to login page */}
                <p style={{ marginTop: "10px" }}>
                    Already have an account?{" "}
                    <span
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}
