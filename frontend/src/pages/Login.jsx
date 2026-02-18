import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "", // Only for signup
        email: "" // Only for signup
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            if (isLogin) {
                await login(formData.username, formData.password);
                navigate("/dashboard");
            } else {
                // Register
                const response = await axios.post('/api/auth/signup', {
                    username: formData.username,
                    password: formData.password,
                    name: formData.name,
                    email: formData.email
                });

                if (response.data.success) {
                    setSuccessMessage("Registration successful! Please login.");
                    setIsLogin(true);
                    setFormData({ username: "", password: "", name: "", email: "" });
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during authentication.");
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setSuccessMessage("");
        setFormData({ username: "", password: "", name: "", email: "" });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
                    <p>{isLogin ? "Sign in to your account" : "Join us to manage your cheques efficiently"}</p>
                </div>

                {successMessage && <div className="success-message" style={{ color: 'var(--color-success)', textAlign: 'center', marginBottom: '1rem' }}>{successMessage}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label className="form-label" htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required={!isLogin}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    required={!isLogin}
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username {isLogin && "or Email"}</label>
                        <input
                            type="text"
                            id="username"
                            className="form-input"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary login-btn">
                        {isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <div className="login-footer">
                    {isLogin ? (
                        <>
                            Don't have an account? <span className="toggle-link" onClick={toggleMode} style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold' }}>Sign Up</span>
                            <br /><br />
                            <a href="#">Forgot password?</a>
                        </>
                    ) : (
                        <>
                            Already have an account? <span className="toggle-link" onClick={toggleMode} style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold' }}>Sign In</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
