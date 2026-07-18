import { useState } from "react";
import api from "../services/api";
import "../styles/UploadNoteModal.css";

function UploadNoteModal({
    subjectId,
    closeModal,
    fetchNotes

}) {

    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e) => {

        e.preventDefault();

        if (!title.trim()) {
            setError("Please enter a title.");
            return;
        }

        if (!file) {
            setError("Please choose a file.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("file", file);

            await api.post(
                `/notes/${subjectId}`,

                formData,

                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            alert("Note uploaded successfully.");
            fetchNotes();
            closeModal();
        }

        catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to upload note."
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
                    📄 Upload Note
                </h2>

                <form onSubmit={handleUpload}>

                    <div className="form-group">
                        <label>
                            Note Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter note title"
                            value={title}

                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Choose File
                        </label>

                        <input
                            type="file"
                            accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.zip"

                            onChange={(e) =>
                                setFile(e.target.files[0])
                            }
                            required
                        />
                    </div>

                    {
                        file && (
                            <p className="selected-file">
                                📎 {file.name}
                            </p>
                        )
                    }

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
                                    ?
                                    "Uploading..."
                                    :
                                    "Upload Note"
                            }
                        </button>
                    </div>

                </form>

            </div>

        </div>
    );
}

export default UploadNoteModal;