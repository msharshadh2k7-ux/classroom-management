import { useEffect, useState } from "react";
import api from "../services/api";

function MarkAttendanceModal({
    subjectId,
    closeModal,
    refreshAttendance
}) {
    const [students, setStudents] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        fetchStudents();

    }, []);

    const fetchStudents = async () => {

        try {
            const response = await api.get("/attendance/students");

            const studentList = response.data.map((student) => ({

                user_id: student.id,
                name: student.name,
                status: "Present"

            }));
            setStudents(studentList);
        }

        catch (error) {
            console.error(error);

            alert("Unable to load students.");
        }
    };

    const changeStatus = (index, status) => {
        const updated = [...students];
        updated[index].status = status;
        setStudents(updated);
    };

    const submitAttendance = async () => {

        if (!attendanceDate) {
            return alert("Select attendance date.");
        }

        try {
            setLoading(true);

            await api.post(

                `/attendance/${subjectId}/attendance`,

                {
                    attendance_date: attendanceDate,
                    students
                }
            );
            alert("Attendance marked successfully.");
            refreshAttendance();
        }

        catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to mark attendance."
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">

            <div className="attendance-modal">
                <h2>Mark Attendance</h2>

                <label>
                    Attendance Date
                </label>

                <input
                    type="date"
                    value={attendanceDate}

                    onChange={(e) =>
                        setAttendanceDate(e.target.value)
                    }
                />

                <div className="student-list">
                    {
                        students.map((student, index) => (

                            <div
                                key={student.user_id}
                                className="student-row"
                            >

                                <span>
                                    {student.name}
                                </span>

                                <select
                                    value={student.status}

                                    onChange={(e) =>
                                        changeStatus(
                                            index,
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="Present">
                                        Present
                                    </option>

                                    <option value="Absent">
                                        Absent
                                    </option>

                                    <option value="No Class">
                                        No Class
                                    </option>
                                </select>
                            </div>
                        ))
                    }
                </div>

                <div className="modal-buttons">
                    <button
                        className="cancel-btn"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>

                    <button
                        className="save-btn"
                        onClick={submitAttendance}
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Saving..."
                                : "Save Attendance"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}

export default MarkAttendanceModal;