import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CreateExamModal from "../components/CreateExamModal";
import EditExamModal from "../components/EditExamModal";
import api from "../services/api";
import "../styles/exams.css";

function Exams() {

    // User Role
    const role = localStorage.getItem("role");

    // States
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedExam, setSelectedExam] = useState(null);

    // Fetch Exams
    const fetchExams = async () => {

        try {
            setLoading(true);
            const response = await api.get("/exams");
            setExams(response.data);
        }

        catch (err) {
            console.error(err);
            setError("Unable to load exams.");
        }

        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    // Delete Exam
    const deleteExam = async (examId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this exam?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/exams/${examId}`);
            fetchExams();
        }

        catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to delete exam."
            );
        }
    };

    // Open Edit Modal
    const openEditModal = (exam) => {
        setSelectedExam(exam);
        setShowEditModal(true);
    };

    return (
        <div className="dashboard">

            <Sidebar />

            <div className="dashboard-content">

                {/* Header */}
                <div className="exam-header">

                    <div className="exam-title">
                        <h2>📝 Classroom Exams</h2>

                        <p>
                            View upcoming examinations,
                            venue and syllabus.
                        </p>
                    </div>

                    {
                        role === "CR" && (
                            <button
                                className="create-exam-btn"
                                onClick={() =>
                                    setShowCreateModal(true)
                                }
                            >
                                ➕ Create Exam
                            </button>
                        )
                    }
                </div>

                {/* Loading */}

                {
                    loading && (
                        <div className="loading">
                            Loading Exams...
                        </div>
                    )
                }

                {/* Error */}
                {
                    error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )
                }

                {/* Exam Grid */}

                {
                    !loading && !error && (
                        <div className="exam-grid">

                            {
                                exams.length === 0 ? (

                                    <div className="empty-card">
                                        <h3>
                                            📚 No Exams Scheduled
                                        </h3>

                                        <p>
                                            Create a new exam to get started.
                                        </p>
                                    </div>

                                ) : (

                                    exams.map((exam) => (

                                        <div
                                            className="exam-card"
                                            key={exam.id}
                                        >
                                            {/* Header */}

                                            <div className="exam-top">
                                                <h3 className="exam-name">
                                                    📘 {exam.exam_name}
                                                </h3>

                                                <span className="subject-badge">
                                                    {exam.subject_name}
                                                </span>
                                            </div>

                                            {/* Exam Details */}

                                            <div className="exam-details">

                                                <div className="detail-row">
                                                    <span>📅 Date</span>

                                                    <span>
                                                        {
                                                            new Date(
                                                                exam.exam_date
                                                            ).toLocaleDateString()
                                                        }
                                                    </span>
                                                </div>

                                                <div className="detail-row">
                                                    <span>⏰ Time</span>
                                                    <span>
                                                        {exam.exam_time}
                                                    </span>
                                                </div>

                                                <div className="detail-row">
                                                    <span>📍 Venue</span>

                                                    <span>
                                                        {exam.venue}
                                                    </span>
                                                </div>

                                                <div className="detail-row">
                                                    <span>🎯 Marks</span>

                                                    <span>
                                                        {exam.maximum_marks}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Portion */}
                                            <div className="portion-box">
                                                <h4>
                                                    📖 Portion
                                                </h4>
                                                <p>
                                                    {exam.portion}
                                                </p>
                                            </div>

                                            {/* CR Actions */}

                                            {
                                                role === "CR" && (

                                                    <div className="exam-actions">
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                openEditModal(exam)
                                                            }
                                                        >
                                                            ✏️ Edit
                                                        </button>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                deleteExam(exam.id)
                                                            }
                                                        >
                                                            🗑 Delete
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    )
                }

                {/* Create Exam Modal */}

                {
                    showCreateModal && (
                        <CreateExamModal
                            closeModal={() =>
                                setShowCreateModal(false)
                            }

                            fetchExams={() => {
                                fetchExams();
                                setShowCreateModal(false);
                            }}
                        />
                    )
                }

                {/* Edit Exam Modal */}

                {
                    showEditModal &&
                    selectedExam && (

                        <EditExamModal
                            exam={selectedExam}

                            closeModal={() => {
                                setShowEditModal(false);
                                setSelectedExam(null);
                            }}

                            fetchExams={() => {
                                fetchExams();
                                setShowEditModal(false);
                                setSelectedExam(null);
                            }}
                        />
                    )
                }
            </div>

        </div>

    );

}

export default Exams;