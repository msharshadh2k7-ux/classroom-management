import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AddAnnouncementModal from "../components/AddAnnouncementModal";
import EditAnnouncementModal from "../components/EditAnnouncementModal";
import api from "../services/api";
import "../styles/announcements.css";

function Announcements() {

    // User Role

    const role = localStorage.getItem("role");

    // States
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    // Fetch Announcements
    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await api.get("/announcements");
            setAnnouncements(response.data);
        }

        catch (error) {

            console.error(error);

            setError("Unable to load announcements.");

        }

        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // Delete Announcement
    const deleteAnnouncement = async (id) => {

        if (!window.confirm(
            "Delete this announcement?"
        )) {
            return;
        }

        try {
            await api.delete(
                `/announcements/${id}`
            );
            fetchAnnouncements();
        }

        catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete announcement."
            );
        }
    };

    // Open Edit Modal

    const openEditModal = (announcement) => {
        setSelectedAnnouncement(
            announcement
        );
        setShowEditModal(true);
    };

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="dashboard-content">
                {/* Header */}
                <div className="announcement-header">
                    <div className="announcement-title">
                        <h2>📢 Announcements</h2>
                        <p>
                            Stay updated with the latest classroom announcements.
                        </p>
                    </div>

                    {
                        role === "CR" && (
                            <button
                                className="create-announcement-btn"
                                onClick={() =>
                                    setShowCreateModal(true)

                                }
                            >
                                + Add Announcement
                            </button>
                        )
                    }
                </div>

                {/* Loading */}
                {
                    loading && (
                        <div className="loading">
                            Loading Announcements...
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
                {/* Announcement List */}

                {
                    !loading && !error && (

                        <div className="announcement-grid">
                            {
                                announcements.length === 0 ?
                                (
                                    <div className="empty-card">
                                        <h3>
                                            No Announcements Available
                                        </h3>
                                    </div>
                                )
                                :
                                (
                                    announcements.map((announcement) => (

                                        <div
                                            className="announcement-card"
                                            key={announcement.id}
                                        >

                                            <div className="announcement-top">
                                                <h3>
                                                    {announcement.title}
                                                </h3>

                                                <span className="announcement-date">
                                                    {
                                                        new Date(
                                                            announcement.created_at
                                                        ).toLocaleDateString()
                                                    }
                                                </span>
                                            </div>

                                            <div className="announcement-body">
                                                {announcement.body}
                                            </div>

                                            {
                                                role === "CR" && (

                                                    <div className="announcement-actions">
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    announcement
                                                                )
                                                            }
                                                        >
                                                            ✏ Edit
                                                        </button>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                deleteAnnouncement(
                                                                    announcement.id
                                                                )
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

                {/* Create Modal */}

                {
                    showCreateModal && (

                        <AddAnnouncementModal
                            closeModal={() =>
                                setShowCreateModal(false)
                            }

                            fetchAnnouncements={() => {
                                fetchAnnouncements();
                                setShowCreateModal(false);
                            }}
                        />
                    )
                }

                {/* Edit Modal */}

                {
                    showEditModal &&
                    selectedAnnouncement && (
                        <EditAnnouncementModal
                            announcement={selectedAnnouncement}

                            closeModal={() => {
                                setShowEditModal(false);
                                setSelectedAnnouncement(null);
                            }}
                            fetchAnnouncements={() => {
                                fetchAnnouncements();
                                setShowEditModal(false);
                                setSelectedAnnouncement(null);
                            }}
                        />
                    )
                }
            </div>

        </div>

    );

}

export default Announcements;