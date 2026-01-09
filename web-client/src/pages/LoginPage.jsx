import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from "react-router-dom";

// LoginPage component handles user login
export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // simple client-side validation
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        // call the login service
        try {
            setLoading(true);
            const { userId, token } = await login(username, password);
            localStorage.setItem("userId", userId);
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            navigate("/drive");

        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // Return the login form UI
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p style={{ marginTop: "12px", textAlign: "center" }}>
                        Don&apos;t have an account?{" "}
                        <span
                            style={{ color: "#2563eb", cursor: "pointer" }}
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
