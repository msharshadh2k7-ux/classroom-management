import { useState } from "react";
import api from "../services/api";

function EditAttendanceModal({
    subjectId,
    closeModal,
    refreshAttendance
}) {

    const [attendanceDate, setAttendanceDate] = useState("");

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);

    // =========================
    // Load Attendance
    // =========================

    const loadAttendance = async () => {

        if (!attendanceDate) {

            return alert("Select attendance date.");

        }

        try {

            setLoading(true);

            const response = await api.get(

                `/attendance/${subjectId}/attendance/date?date=${attendanceDate}`

            );

            setStudents(response.data);

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Unable to load attendance."

            );

        }

        finally {

            setLoading(false);

        }

    };

    // =========================
    // Change Status
    // =========================

    const changeStatus = (index, status) => {

        const updated = [...students];

        updated[index].status = status;

        setStudents(updated);

    };

    // =========================
    // Update Attendance
    // =========================

    const updateAttendance = async () => {

        try {

            setLoading(true);

            await api.put(

                `/attendance/${subjectId}/attendance`,

                {

                    attendance_date: attendanceDate,

                    students

                }

            );

            alert("Attendance updated successfully.");

            refreshAttendance();

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Unable to update attendance."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="attendance-modal">

                <h2>Edit Attendance</h2>

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

                <button

                    className="load-btn"

                    onClick={loadAttendance}

                >

                    Load Attendance

                </button>

                {

                    students.length > 0 && (

                        <div className="student-list">

                            {

                                students.map((student, index) => (

                                    <div

                                        key={student.id}

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

                    )

                }

                <div className="modal-buttons">

                    <button

                        className="cancel-btn"

                        onClick={closeModal}

                    >

                        Cancel

                    </button>

                    <button

                        className="save-btn"

                        onClick={updateAttendance}

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Updating..."

                                : "Update Attendance"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default EditAttendanceModal;