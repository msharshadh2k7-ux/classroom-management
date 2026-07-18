import { useState } from "react";
import api from "../services/api";
import "../styles/CreatePollModal.css";

function CreatePollModal({ closeModal, fetchPolls }) {

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        "",
        ""
    ]);

    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Add New Option
    const addOption = () => {
        setOptions([
            ...options,
            ""
        ]);
    };

    // Update Option
    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Create Poll
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/polls", {
                question,
                options,
                end_time: endTime
            });
            fetchPolls();
            closeModal();
        }

        catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create poll."
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
                    Create Poll
                </h2>

                <form onSubmit={handleSubmit}>

                    {/* Question */}

                    <div className="form-group">

                        <label>
                            Poll Question
                        </label>

                        <input
                            type="text"
                            placeholder="Enter Question"
                            value={question}

                            onChange={(e) =>
                                setQuestion(e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* Options */}
                    {
                        options.map((option, index) => (

                            <div
                                className="form-group"
                                key={index}
                            >
                                <label>
                                    Option {index + 1}
                                </label>

                                <input
                                    type="text"
                                    placeholder={`Option ${index + 1}`}
                                    value={option}

                                    onChange={(e) =>
                                        updateOption(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        ))
                    }

                    <button
                        type="button"
                        className="add-option-btn"
                        onClick={addOption}
                    >
                        + Add Option
                    </button>

                    {/* End Time */}

                    <div className="form-group">
                        <label>
                            End Time
                        </label>

                        <input
                            type="datetime-local"
                            value={endTime}

                            onChange={(e) =>
                                setEndTime(e.target.value)
                            }
                            required
                        />
                    </div>

                    {
                        error &&

                        <p className="error">
                            {error}
                        </p>
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
                                : "Create Poll"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreatePollModal;