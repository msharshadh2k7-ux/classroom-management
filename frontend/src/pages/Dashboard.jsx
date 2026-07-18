import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function Dashboard() {

    // User Details
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name") || "Student";

    return (

        <div className="dashboard">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="dashboard-content">

                {/* Welcome Section */}
                <div className="welcome-card">

                    <div>
                        <h2>
                            👋 Welcome,
                            {" "}
                            {name}
                        </h2>
                        <p>
                            Classroom Management System
                        </p>
                        <span>
                            Manage your classroom activities efficiently.
                        </span>
                    </div>

                    <div className="role-badge">
                        {role}
                    </div>

                </div>

                {/* Feature Cards */}

                <div className="dashboard-grid">

                    {/* Subject Management */}
                    <div className="dashboard-card">
                        <i className="bi bi-book-half dashboard-icon"></i>
                        <h3>
                            Subject Management
                        </h3>
                        <p>
                            Manage all classroom subjects.
                        </p>
                        <ul>
                            <li>Attendance</li>
                            <li>Notes</li>
                        </ul>

                        <Link
                            to="/subjects"
                            className="btn btn-primary"
                        >
                            Open
                        </Link>
                    </div>

                    {/* Announcements */}
                    <div className="dashboard-card">
                        <i className="bi bi-megaphone-fill dashboard-icon"></i>
                        <h3>
                            Announcements
                        </h3>
                        <p>
                            Stay updated with classroom announcements.
                        </p>

                        <Link
                            to="/announcements"
                            className="btn btn-success"
                        >
                            View
                        </Link>

                    </div>
                    {/* Polls */}
                    <div className="dashboard-card">
                        <i className="bi bi-bar-chart-fill dashboard-icon"></i>
                        <h3>
                         Polls
                        </h3>
                        <p>
                            Participate in classroom polls.
                        </p>

                        <Link
                            to="/polls"
                            className="btn btn-warning"
                        >
                            Open
                        </Link>
                    </div>

                    {/* Exams */}
                    <div className="dashboard-card">
                        <i className="bi bi-journal-check dashboard-icon"></i>
                        <h3>
                            Exams
                        </h3>
                        <p>
                            View exam schedules and updates.
                        </p>

                        <Link
                            to="/exams"
                            className="btn btn-danger"
                        >
                            View
                        </Link>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="bottom-grid">

                    {/* Upcoming Exams */}
                    <div className="info-card">
                        <h3>
                            📅 Upcoming Exams
                        </h3>

                        <hr />

                        <div className="info-item">
                            <strong>
                                No Upcoming Exams
                            </strong>

                            <span>
                                Exams will appear here.
                            </span>
                        </div>

                        <Link
                            to="/exams"
                            className="view-link"
                        >
                            View All →
                        </Link>
                    </div>

                    {/* Recent Announcements */}

                    <div className="info-card">
                        <h3>
                            📢 Recent Announcements
                        </h3>

                        <hr />

                        <div className="info-item">
                            <strong>
                                No Announcements
                            </strong>

                            <span>
                                Latest announcements will appear here.
                            </span>
                        </div>

                        <Link
                            to="/announcements"
                            className="view-link"
                        >
                            View All →
                        </Link>
                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;