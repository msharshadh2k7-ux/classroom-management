import { useState } from "react";
import api from "../services/api";
import "../styles/AddAnnouncementModal.css";

function EditAnnouncementModal({
    announcement,
    closeModal,
    fetchAnnouncements
}) {

    const [title, setTitle] = useState(
        announcement.title
    );

    const [description, setDescription] = useState(
        announcement.body
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Update Announcement
    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.put(
                `/announcements/${announcement.id}`,
                {
                    title,
                    description
                }
            );
            fetchAnnouncements();
            closeModal();
        }

        catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update announcement."
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
                    ✏ Edit Announcement
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>
                            Title
                        </label>

                        <input
                            type="text"
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
                                    ? "Updating..."
                                    : "Update Announcement"
                            }
                        </button>
                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditAnnouncementModal;