import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/CreateExamModal.css";

function EditExamModal({
    exam,
    closeModal,
    fetchExams
}) {

    const [subjects, setSubjects] = useState([]);
    const [subjectId, setSubjectId] = useState(exam.subject_id);
    const [examName, setExamName] = useState(exam.exam_name);
    const [examDate, setExamDate] = useState(
        exam.exam_date?.split("T")[0]
    );
    const [examTime, setExamTime] = useState(exam.exam_time);
    const [venue, setVenue] = useState(exam.venue);
    const [maximumMarks, setMaximumMarks] = useState(
        exam.maximum_marks
    );
    const [portion, setPortion] = useState(exam.portion);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchSubjects = async () => {

            try {
                const res = await api.get("/subjects");

                setSubjects(res.data);

            } catch (error) {
                console.error(error);
            }
        };
        fetchSubjects()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.put(
                `/exams/${exam.id}`,
                {
                    subject_id: subjectId,
                    exam_name: examName,
                    exam_date: examDate,
                    exam_time: examTime,
                    venue,
                    maximum_marks: maximumMarks,
                    portion
                }
            );
            fetchExams();
            closeModal();
        }

        catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update exam."
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">

            <div className="modal-card">

                <h2>Edit Exam</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Subject</label>

                        <select
                            value={subjectId}
                            onChange={(e) =>
                                setSubjectId(e.target.value)
                            }
                            required
                        >

                            {
                                subjects.map(subject => (
                                    <option
                                        key={subject.id}
                                        value={subject.id}
                                    >
                                        {subject.subject_name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Exam Name</label>

                        <input
                            type="text"
                            value={examName}

                            onChange={(e) =>
                                setExamName(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="form-group">
                        <label>Exam Date</label>

                        <input
                            type="date"
                            value={examDate}
                            onChange={(e) =>
                                setExamDate(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Exam Time</label>

                        <input
                            type="time"
                            value={examTime}
                            onChange={(e) =>
                                setExamTime(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Venue</label>

                        <input
                            type="text"
                            value={venue}

                            onChange={(e) =>
                                setVenue(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Maximum Marks</label>

                        <input
                            type="number"
                            value={maximumMarks}
                            onChange={(e) =>
                                setMaximumMarks(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Portion</label>

                        <textarea
                            rows="4"
                            value={portion}

                            onChange={(e) =>
                                setPortion(e.target.value)
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
                                    : "Update Exam"
                            }
                        </button>
                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditExamModal;