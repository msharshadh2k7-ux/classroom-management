import { useState } from "react";
import api from "../services/api";
import "../styles/AddSubjectModal.css"

function AddSubjectModal({ closeModal, fetchSubjects }) {

    // Store Subject Name
    const [subjectName, setSubjectName] = useState("");

    // Store Subject Code
    const [subjectCode, setSubjectCode] = useState("");

    // Loading State
    const [loading, setLoading] = useState(false);

    // Error Message
    const [error, setError] = useState("");

    // Create Subject
    const handleSubmit = async (e) => {

        // Prevent page refresh
        e.preventDefault();

        // Clear previous error
        setError("");

        // Start loading
        setLoading(true);

        try {
            // Send subject data to backend
            await api.post("/subjects", {
                subject_name: subjectName,
                subject_code: subjectCode
            });

            // Reload subjects list
            fetchSubjects();

            // Close popup
            closeModal();
        }

        catch (err) {
            // Show backend error
            if (err.response) {
                setError(err.response.data.message);
            }

            // Show server error
            else {
                setError("Unable to create subject.");
            }
        }

        finally {
            // Stop loading
            setLoading(false);
        }
    };

    return (
        // Dark background
        <div className="modal-overlay">

            {/* Popup Card */}
            <div className="modal-card">

                <h2>Add Subject</h2>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Subject Name */}
                    <div className="form-group">
                        <label>
                            Subject Name
                        </label>

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

                    {/* Subject Code */}
                    <div className="form-group">
                        <label>
                            Subject Code
                        </label>

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

                    {/* Error */}
                    {
                        error && (
                            <p className="error">
                                {error}
                            </p>
                        )
                    }

                    {/* Buttons */}
                    <div className="modal-buttons">

                        {/* Close Popup */}
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>

                        {/* Create Subject */}
                        <button
                            type="submit"
                            className="create-btn"
                            disabled={loading}
                        >
                            {
                                loading
                                    ? "Creating..."
                                    : "Create Subject"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddSubjectModal;