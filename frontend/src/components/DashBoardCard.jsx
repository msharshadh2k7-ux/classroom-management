import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function Dashboard() {

    // Get user's role
    const role = localStorage.getItem("role");
    return (
        <div className="dashboard">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="dashboard-content">

                <h2>Welcome 👋</h2>
                <p>Classroom Management System</p>

                {/* Cards */}
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <i className="bi bi-book-fill"></i>
                        <h4>Subjects</h4>
                    </div>

                    <div className="dashboard-card">
                        <i className="bi bi-calendar-check-fill"></i>
                        <h4>Attendance</h4>
                    </div>

                    <div className="dashboard-card">
                        <i className="bi bi-file-earmark-text-fill"></i>
                        <h4>Notes</h4>
                    </div>

                    <div className="dashboard-card">
                        <i className="bi bi-megaphone-fill"></i>
                        <h4>Announcements</h4>
                    </div>

                    <div className="dashboard-card">
                        <i className="bi bi-bar-chart-fill"></i>
                        <h4>Polls</h4>
                    </div>

                    <div className="dashboard-card">
                        <i className="bi bi-pencil-square"></i>
                        <h4>Exams</h4>
                    </div>

                    <div className="dashboard-card">
                        <i className="bi bi-person-circle"></i>
                        <h4>Profile</h4>
                    </div>

                    {/* Visible only for CR */}
                    {role === "CR" && (
                        <div className="dashboard-card cr-card">
                            <i className="bi bi-shield-check"></i>
                            <h4>CR Panel</h4>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}

export default Dashboard;