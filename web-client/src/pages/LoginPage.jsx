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
            const { token } = await login(username, password);

            // store token for later requests
            localStorage.setItem('token', token);

            // navigation will be handled in protected routes story
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // Return the login form UI
    return (
        <div style={{ maxWidth: 400, margin: '40px auto' }}>
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
                {/* Extra navigation link to register page */}
                <p style={{ marginTop: "10px" }}>
                    Don&apos;t have an account?{" "}
                    <span
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
}
