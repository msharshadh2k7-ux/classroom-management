import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
    FaBars,
    FaHome,
    FaBook,
    FaBullhorn,
    FaPoll,
    FaClipboardList,
    FaUser,
    FaSignOutAlt,
    FaGraduationCap
} from "react-icons/fa";

import "../styles/sidebar.css";

function Sidebar() {

    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const name = localStorage.getItem("name") || "Student";
    const role = localStorage.getItem("role") || "Student";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <>

            {/* Hamburger */}
            <button
                className="menu-toggle"
                onClick={toggleSidebar}
            >
                <FaBars />
            </button>

            <aside
                className={
                    collapsed
                        ? "sidebar collapsed"
                        : "sidebar"
                }
            >

            {/* Logo */}

                <div className="sidebar-logo">
                    <FaGraduationCap className="logo-icon" />

                    {
                        !collapsed && (
                            <div>
                                <h2>
                                    ClassRoom
                                </h2>

                                <p>
                                    Management System
                                </p>
                            </div>
                        )
                    }
                </div>

                {/* Profile */}

                <div className="sidebar-profile">

                    <div className="profile-avatar">
                        <FaUser />
                    </div>

                    {
                        !collapsed && (
                            <>
                                <h3>
                                    {name}
                                </h3>
                                <span className="role-badge">
                                    {role}
                                </span>
                            </>
                        )
                    }
                </div>

                {/* Navigation */}

                <nav className="sidebar-menu">

                    <NavLink to="/dashboard">
                        <FaHome />
                        {
                            !collapsed &&
                            <span>Dashboard</span>
                        }
                    </NavLink>

                    <NavLink to="/subjects">
                        <FaBook />
                        {
                            !collapsed &&
                            <span>Subject Management</span>
                        }
                    </NavLink>

                    <NavLink to="/announcements">
                        <FaBullhorn />
                        {
                            !collapsed &&
                            <span>Announcements</span>
                        }
                    </NavLink>

                    <NavLink to="/polls">
                        <FaPoll />
                        {
                            !collapsed &&
                            <span>Polls</span>
                        }
                    </NavLink>

                    <NavLink to="/exams">
                        <FaClipboardList />
                        {
                            !collapsed &&
                            <span>Exams</span>
                        }
                    </NavLink>

                    <NavLink to="/profile">
                        <FaUser />
                        {
                            !collapsed &&
                            <span>Profile</span>
                        }
                    </NavLink>
                </nav>

                {/* Logout */}

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                    {
                        !collapsed &&
                        <span>
                            Logout
                        </span>
                    }
                </button>

            </aside>
        </>
    );
}

export default Sidebar;