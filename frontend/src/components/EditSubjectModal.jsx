import { useState } from "react";
import api from "../services/api";
import "../styles/AddSubjectModal.css";

function EditSubjectModal({
    subject,
    closeModal,
    fetchSubjects
}) {

    // Existing Subject Details
    const [subjectName, setSubjectName] = useState(subject.subject_name);
    const [subjectCode, setSubjectCode] = useState(subject.subject_code);

    // Loading State
    const [loading, setLoading] = useState(false);

    // Error State
    const [error, setError] = useState("");

    // Update Subject
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await api.put(`/subjects/${subject.id}`, {
                subject_name: subjectName,
                subject_code: subjectCode
            });

            fetchSubjects();

            closeModal();

        } catch (err) {

            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError("Unable to update subject.");
            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="modal-card">

                <h2>Edit Subject</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Subject Name</label>

                        <input
                            type="text"
                            placeholder="Enter Subject Name"
                            value={subjectName}
                            onChange={(e) =>
                                setSubjectName(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Subject Code</label>

                        <input
                            type="text"
                            placeholder="Enter Subject Code"
                            value={subjectCode}
                            onChange={(e) =>
                                setSubjectCode(e.target.value)
                            }
                            required
                        />

                    </div>

                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

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
                                    : "Update Subject"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditSubjectModal;