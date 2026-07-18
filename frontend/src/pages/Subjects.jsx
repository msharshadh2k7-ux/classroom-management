import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddSubjectModal from "../components/AddSubjectModal";
import EditSubjectModal from "../components/EditSubjectModal";
import api from "../services/api";
import "../styles/subjects.css";

function Subjects() {

    const navigate = useNavigate();

    // User Role
    const role = localStorage.getItem("role");

    // States
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Add Subject Modal
    const [showModal, setShowModal] = useState(false);

    // Edit Subject Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Fetch Subjects
    const fetchSubjects = async () => {

        try {

            const response = await api.get("/subjects");
            setSubjects(response.data);

        }

        catch (err) {

            console.error(err);
            setError("Unable to load subjects.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchSubjects();

    }, []);

    // Delete Subject
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this subject?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/subjects/${id}`);

            fetchSubjects();

        }

        catch (err) {

            alert(err.response?.data?.message || "Delete Failed");

        }

    };

    // Edit Subject
    const handleEdit = (subject) => {

        setSelectedSubject(subject);

        setShowEditModal(true);

    };

    // Open Subject
    const handleOpen = (subject) => {

        navigate(`/subjects/${subject.id}`);

    };

    return (
        <>
            <div className="dashboard">

                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="dashboard-content">

                    {/* Header */}
                    <div className="subjects-header">

                        <div>
                            <h2>
                                <i className="bi bi-book-half"></i>{" "}
                                Subject Management
                            </h2>

                            <p>
                                Manage attendance and notes for all classroom subjects.
                            </p>
                        </div>

                        {role === "CR" && (

                            <button
                                className="add-subject-btn"
                                onClick={() => setShowModal(true)}
                            >
                                <i className="bi bi-plus-circle-fill"></i>{" "}
                                Add Subject
                            </button>

                        )}

                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="loading">
                            Loading Subjects...
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Subject Cards */}
                    {!loading && !error && (

                        <div className="subjects-grid">

                            {subjects.length === 0 ? (

                                <div className="empty-subject">
                                    <i className="bi bi-journal-x"></i>
                                    <h3>No Subjects Found</h3>
                                </div>

                            ) : (

                                subjects.map((subject) => (

                                    <div
                                        className="subject-card"
                                        key={subject.id}
                                    >

                                        <div className="subject-icon">
                                            <i className="bi bi-book"></i>
                                        </div>

                                        <div className="subject-info">
                                            <h3>{subject.subject_name}</h3>

                                            <p>
                                                Code : {subject.subject_code}
                                            </p>
                                        </div>

                                        <hr />

                                        <p className="subject-description">
                                            Manage attendance and notes for this subject.
                                        </p>

                                        <div className="subject-actions">

                                            <button
                                                className="open-btn"
                                                onClick={() => handleOpen(subject)}
                                            >
                                                <i className="bi bi-box-arrow-up-right"></i>{" "}
                                                Open
                                            </button>

                                            {role === "CR" && (
                                                <>
                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => handleEdit(subject)}
                                                    >
                                                        <i className="bi bi-pencil"></i>{" "}
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDelete(subject.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>{" "}
                                                        Delete
                                                    </button>
                                                </>
                                            )}

                                        </div>

                                    </div>

                                ))

                            )}

                        </div>

                    )}

                </div>

            </div>

            {/* Add Subject Modal */}
            {showModal && (
                <AddSubjectModal
                    closeModal={() => setShowModal(false)}
                    fetchSubjects={fetchSubjects}
                />
            )}

            {/* Edit Subject Modal */}
            {showEditModal && (
                <EditSubjectModal
                    subject={selectedSubject}
                    closeModal={() => setShowEditModal(false)}
                    fetchSubjects={fetchSubjects}
                />
            )}

        </>
    );
}

export default Subjects;