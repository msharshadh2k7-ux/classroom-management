import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/signup.css";

function Signup() {

    const [formData, setFormData] = useState({

        name: "",
        email: "",
        password: "",
        department: "",
        year: "",
        section: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async (e) => {

        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/auth/signup",
                formData
            );
            alert(response.data.message);
            navigate("/login");
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
        <div className="signup-container">

            <div className="signup-card">

                <h2>
                    🎓 Classroom <br />
                    Management System
                </h2>

                <p className="signup-subtitle">
                    Academic Registration Portal
                </p>

                <form onSubmit={handleSignup}>

                    {/* Name */}

                    <div className="input-group-custom">
                        <i className="bi bi-person-fill input-icon"></i>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}

                    <div className="input-group-custom">
                        <i className="bi bi-envelope-fill input-icon"></i>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter College Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}

                    <div className="input-group-custom">

                        <i className="bi bi-lock-fill input-icon"></i>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={handleChange}
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

                    {/* Department */}

                    <div className="input-group-custom">
                        <i className="bi bi-building-fill input-icon"></i>

                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >

                            <option value="">Select Department</option>

                            <option value="Chemical Engineering">Chemical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                            <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                            <option value="Instrumentation and Control Engineering">Instrumentation and Control Engineering</option>
                            <option value="Materials and Metallurgical Engineering">Materials and Metallurgical Engineering</option>
                        </select>

                    </div>

                    {/* Year & Section */}

                    <div className="signup-row">

                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                        >
                            <option value="">📚 Academic Year</option>

                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>

                        <select
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            required
                        >
                            <option value="">👥 Section</option>

                            <option value="A">A</option>
                            <option value="B">B</option>
                        </select>
                    </div>

                    {/* Error */}

                    {
                        error &&
                        <p className="error">
                            {error}
                        </p>
                    }

                    {/* Button */}

                    <button
                        type="submit"
                        className="signup-btn"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Creating Account..."
                                : "🚀 Create Account"
                        }
                    </button>
                </form>

                <div className="signup-footer">

                    🔐 Already have an account?
                    {" "}

                    <Link to="/login">
                        Login
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default Signup;