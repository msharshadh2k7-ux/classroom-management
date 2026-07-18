import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/login.css";

function Login() {
    // Form Data
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Show / Hide Password
    const [showPassword, setShowPassword] = useState(false);
    // Error Message
    const [error, setError] = useState("");
    // Loading State
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle Login
    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            // Save Token
            localStorage.setItem("token", response.data.token);
            // Save Role
            localStorage.setItem("role", response.data.role);
            // Save Name
            localStorage.setItem("name", response.data.name);
            // Go to Dashboard
            navigate("/dashboard");
        }

        catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            }

            else {
                setError("Unable to connect to server.");
            }
        }

        finally {
            setLoading(false);
        }
    };

    return (
    <div className="login-container">

        <div className="login-card">
            <h2> 🎓 Classroom Management System</h2>

            <p className="login-subtitle">
                Student / CR Login
            </p>

            <form onSubmit={handleLogin}>

                {/* Email */}

                <div className="input-group-custom">
                    <i className="bi bi-envelope-fill input-icon"></i>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Password */}

                <div className="input-group-custom">

                    <i className="bi bi-lock-fill input-icon"></i>

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <i
                        className={`bi ${
                            showPassword
                                ? "bi-eye-slash-fill"
                                : "bi-eye-fill"
                        } eye-icon`}
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                    ></i>
                </div>

                {/* Error */}

                {
                    error &&
                    <p className="error">
                        {error}
                    </p>
                }

                {/* Forgot Password */}

                <div className="forgot-password">
                    <Link to="/forgot-password">
                        Forgot Password?
                    </Link>
                </div>

                {/* Login Button */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                            ? "Logging In..."
                            : "Login"
                    }
                </button>
            </form>

            <div className="login-footer">
                Don't have an account?
                {" "}
                <Link to="/signup">
                    Register
                </Link>
            </div>

        </div>

    </div>
);
}

export default Login;