import { useState } from "react";
import api from "../services/api";
import "../styles/AddAnnouncementModal.css";

function AddAnnouncementModal({
    closeModal,
    fetchAnnouncements
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Create Announcement

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/announcements", {
                title,
                description
            });

            fetchAnnouncements();
            closeModal();
        }

        catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to create announcement."
            );
        }

        finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">

            <div className="modal-card">

                <h2>
                    📢 Create Announcement
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter announcement title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            rows="6"
                            placeholder="Enter announcement details"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }

                            required
                        />

                    </div>

                    {
                        error && (
                            <p className="error">
                                {error}
                            </p>
                        )
                    }

                    <div className="modal-buttons">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-btn"
                            disabled={loading}
                        >

                            {
                                loading
                                    ? "Creating..."
                                    : "Create Announcement"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddAnnouncementModal;