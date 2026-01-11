import React, { useState } from 'react';
import logo from "../assets/logo.png";
import { login } from '../services/authService';
import { useNavigate } from "react-router-dom";

// LoginPage Component
export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }
        // Attempt login
        try {
            setLoading(true);
            const { userId, token } = await login(username, password);
            
            localStorage.setItem("userId", userId);
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            
            navigate("/drive");
        // Redirect to Drive page on success
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // Styles
    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            padding: "30px",
            justifyContent: "center",
            height: "100%",
            boxSizing: "border-box"
        },
        header: {
            textAlign: "center",
            marginBottom: "35px"
        },
        inputGroup: {
            marginBottom: "15px"
        },
        input: {
            width: "100%",
            padding: "12px 12px",
            borderRadius: "6px",
            border: "1px solid #dadce0",
            fontSize: "1rem",
            background: "#ffffff",
            color: "#202124",
            outline: "none",
            boxSizing: "border-box",
            height: "44px"
        },
        label: {
            display: "block",
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "#5f6368",
            marginBottom: "6px",
            marginLeft: "2px"
        },
        button: {
            marginTop: "25px",
            padding: "12px",
            borderRadius: "25px",
            fontSize: "1rem",
            background: "linear-gradient(45deg, #1a73e8, #4285f4)",
            border: "none",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(26, 115, 232, 0.3)",
            width: "100%",
            transition: "transform 0.1s"
        },
        errorMsg: {
            color: "#d93025",
            fontSize: "0.9rem",
            textAlign: "center",
            background: "#fce8e6",
            padding: "10px",
            borderRadius: "6px",
            margin: "15px 0",
            border: "1px solid #fad2cf"
        },
        footer: {
             marginTop: "30px", 
             textAlign: "center",
             display: "flex",
             flexDirection: "column",
             gap: "5px"
        },
        linkText: {
            fontSize: "0.95rem",
            color: "#5f6368"
        },
        linkAction: {
            color: "#1a73e8",
            fontWeight: "700",
            fontSize: "1.05rem",
            cursor: "pointer",
            textDecoration: "none"
        }
    };

    return (
    <div className="auth-container">
        <div
            className="auth-card"
            style={{
                maxWidth: "400px",
                padding: "0",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #eee",
            }}
        >
            <div style={styles.container}>
                <div style={styles.header}>

                    {/* LOGO – added only */}
                    <img
                        src={logo}
                        alt="CoDrive"
                        style={{
                            width: "200px",
                            marginBottom: "4px",
                        }}
                    />

                    <h2
                        style={{
                            margin: "0",
                            fontSize: "2rem",
                            color: "#1a73e8",
                            fontWeight: "700",
                        }}
                    >
                        Sign In
                    </h2>

                    <p
                        style={{
                            margin: "8px 0 0 0",
                            fontSize: "1rem",
                            color: "#5f6368",
                        }}
                    >
                        to continue to CoDrive
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            style={styles.input}
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            style={styles.input}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div style={styles.errorMsg}>{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? "Logging in..." : "Sign In"}
                    </button>

                    <div style={styles.footer}>
                        <span style={styles.linkText}>New to CoDrive?</span>
                        <span
                            onClick={() => navigate("/register")}
                            style={styles.linkAction}
                        >
                            Create account
                        </span>
                    </div>
                </form>
            </div>
        </div>
    </div>
);
}