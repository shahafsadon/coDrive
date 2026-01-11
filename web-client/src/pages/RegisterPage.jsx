import React, { useState, useRef } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

export default function RegisterPage() {
    const navigate = useNavigate();

    // State
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    
    // Phone State
    const [countryCode, setCountryCode] = useState("+972");
    const [phoneNumber, setPhoneNumber] = useState("");
    
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Image State
    const [imagePreview, setImagePreview] = useState(null);
    
    // UI State
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    // Handlers
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Validation
    const validate = () => {
        // Check mandatory fields
        if (!username || !fullName || !password || !confirmPassword) {
            return "Please fill mandatory fields (*)";
        }

        // Check password length
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }

        // Check for at least one English letter
        if (!/[a-zA-Z]/.test(password)) {
            return "Password must contain at least one English letter";
        }

        // Check for at least one English letter
        if (password !== confirmPassword) {
            return "Passwords do not match";
        }

        return null;
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        // Combine code and number
        const fullPhoneNumber = phoneNumber ? `${countryCode}${phoneNumber}` : "";

        try {
            await register({
                username,
                fullName,
                password,
                email,
                phoneNumber: fullPhoneNumber,
                birthDate,
                image: imagePreview
            });
            navigate("/login");
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };

    // Compact Styles 
    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            padding: "15px 30px",
            height: "100%",
            boxSizing: "border-box",
            justifyContent: "center"
        },
        header: {
            textAlign: "center",
            marginBottom: "10px"
        },
        avatarContainer: {
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: "#f0f2f5",
            margin: "0 auto 15px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
            border: "3px solid #fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "transform 0.2s"
        },
        inputGroup: {
            marginBottom: "8px"
        },
        input: {
            width: "100%",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #dadce0",
            fontSize: "0.9rem",
            background: "#ffffff",
            color: "#202124",
            outline: "none",
            boxSizing: "border-box",
            height: "36px"
        },
        select: {
            width: "85px",
            padding: "0 5px",
            borderRadius: "6px",
            border: "1px solid #dadce0",
            fontSize: "0.9rem",
            background: "#ffffff",
            color: "#202124",
            outline: "none",
            height: "36px",
            marginRight: "5px",
            cursor: "pointer"
        },
        label: {
            display: "block",
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "#5f6368",
            marginBottom: "2px",
            marginLeft: "2px"
        },
        button: {
            marginTop: "12px",
            padding: "10px",
            borderRadius: "20px",
            fontSize: "0.95rem",
            background: "linear-gradient(45deg, #1a73e8, #4285f4)",
            border: "none",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(26, 115, 232, 0.3)",
            width: "100%"
        },
        errorMsg: {
            color: "#d93025",
            fontSize: "0.8rem",
            textAlign: "center",
            background: "#fce8e6",
            padding: "5px",
            borderRadius: "6px",
            margin: "10px 0"
        },
        link: {
             marginTop: "10px", 
             textAlign: "center", 
             fontSize: "0.85rem", 
             color: "#5f6368" 
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

                    {/* LOGO – added, nothing else changed */}
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
                            fontSize: "1.6rem",
                            color: "#1a73e8",
                            fontWeight: "700",
                        }}
                    >
                        Create Account
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Avatar */}
                    <div
                        style={styles.avatarContainer}
                        onClick={() => fileInputRef.current.click()}
                        title="Upload Profile Picture"
                    >
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Profile"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <span style={{ fontSize: "1.8rem", color: "#ccc" }}>📷</span>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />

                    {/* Username */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            Username <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            style={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </div>

                    {/* Full Name */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            Full Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            style={styles.input}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full Name"
                        />
                    </div>

                    {/* Email */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@address.com"
                        />
                    </div>

                    {/* Split: Phone & Date */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                        <div style={{ flex: 1.4 }}>
                            <label style={styles.label}>Phone</label>
                            <div style={{ display: "flex" }}>
                                <select
                                    style={styles.select}
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                >
                                    <option value="+972">🇮🇱 +972</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+33">🇫🇷 +33</option>
                                    <option value="+49">🇩🇪 +49</option>
                                </select>
                                <input
                                    type="tel"
                                    style={styles.input}
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Number"
                                />
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Birth Date</label>
                            <input
                                type="date"
                                style={styles.input}
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Split: Passwords */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>
                                Password <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="password"
                                style={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>
                                Confirm <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="password"
                                style={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="******"
                            />
                        </div>
                    </div>

                    {error && <div style={styles.errorMsg}>{error}</div>}

                    <button type="submit" style={styles.button}>
                        Register
                    </button>

                    <p style={styles.link}>
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            style={{
                                color: "#1a73e8",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            Log in
                        </span>
                    </p>
                </form>
            </div>
        </div>
    </div>
);
}
