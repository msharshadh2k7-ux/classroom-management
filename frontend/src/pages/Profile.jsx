import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/profile.css";

function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/auth/profile");
            setProfile(res.data);
        } catch (err) {

            console.error(err);
            setError("Unable to load profile.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">

            <Sidebar />
            <div className="dashboard-content">

                <div className="profile-header">
                    <h2>👤 My Profile</h2>
                    <p>View your classroom account details.</p>
                </div>

                {loading && (
                    <div className="loading">
                        Loading Profile...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {profile && (

                    <div className="profile-container">

                        {/* Top Card */}

                        <div className="profile-top-card">
                            <div className="profile-avatar">
                                {profile.name.charAt(0).toUpperCase()}
                            </div>

                            <h2>{profile.name}</h2>

                            <p className="department-text">
                                {profile.department}
                            </p>

                            <span className="role-badge">
                                {profile.role}
                            </span>
                        </div>

                        {/* Information Cards */}

                        <div className="profile-grid">

                            {/* Personal Information */}

                            <div className="info-card">
                                <h3>Personal Information</h3>

                                <div className="detail-row">
                                    <span>Name</span>
                                    <strong>{profile.name}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Email</span>
                                    <strong>{profile.email}</strong>
                                </div>
                            </div>

                            {/* Academic Information */}

                            <div className="info-card">

                                <h3>Academic Information</h3>

                                <div className="detail-row">
                                    <span>Department</span>
                                    <strong>{profile.department}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Year</span>
                                    <strong>{profile.year}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Section</span>
                                    <strong>{profile.section}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Role</span>
                                    <strong>{profile.role}</strong>
                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}

export default Profile;