import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MarkAttendanceModal from "../components/MarkAttendanceModal";
import EditAttendanceModal from "../components/EditAttendanceModal";
import api from "../services/api";
import "../styles/attendance.css";

function Attendance() {

    const { subjectId } = useParams();

    const role = localStorage.getItem("role");

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showMarkModal, setShowMarkModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchAttendance = async () => {

        try {
            const response = await api.get(`/attendance/${subjectId}`);
            setAttendance(response.data);
        }

        catch (err) {
            console.error(err);
            setError("Unable to load attendance.");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const totalClasses = attendance.length;

    const presentClasses = attendance.filter(
        (item) => item.status === "Present"
    ).length;

    const absentClasses = attendance.filter(
        (item) => item.status === "Absent"
    ).length;

    const percentage =
        totalClasses === 0
            ? 0
            : ((presentClasses / totalClasses) * 100).toFixed(1);

    return (

        <div className="dashboard">

            <Sidebar />

            <div className="dashboard-content">

                <div className="attendance-header">

                    <div>
                        <h2>Attendance</h2>

                        <p>
                            View and manage attendance records.
                        </p>
                    </div>

                    {
                        role === "CR" && (

                            <div className="attendance-buttons">

                                <button
                                    className="mark-btn"
                                    onClick={() =>
                                        setShowMarkModal(true)
                                    }
                                >
                                    + Mark Attendance
                                </button>

                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        setShowEditModal(true)
                                    }
                                >
                                    Edit Attendance
                                </button>
                            </div>
                        )
                    }
                </div>

                <div className="attendance-summary">

                    <div className="summary-card">
                        <h3>{totalClasses}</h3>
                        <p>Total Classes</p>
                    </div>

                    <div className="summary-card present">
                        <h3>{presentClasses}</h3>
                        <p>Present</p>
                    </div>

                    <div className="summary-card absent">
                        <h3>{absentClasses}</h3>
                        <p>Absent</p>
                    </div>

                    <div className="summary-card percentage">
                        <h3>{percentage}%</h3>
                        <p>Attendance</p>
                    </div>

                </div>

                {
                    loading && (
                        <div className="loading">
                            Loading Attendance...
                        </div>
                    )
                }

                {
                    error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )
                }

                {
                    !loading &&
                    !error &&
                    (
                        <div className="attendance-table">
                            {
                                attendance.length === 0 ?
                                (
                                    <div className="empty-card">
                                        <h3>
                                            No Attendance Available
                                        </h3>
                                    </div>
                                )
                                :
                                (
                                    <table>

                                        <thead>
                                            <tr>
                                                <th>Date</th>

                                                <th>Subject</th>

                                                <th>Code</th>

                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {
                                                attendance.map((item) => (
                                                    <tr key={item.attendance_date}>
                                                        <td>
                                                            {
                                                                new Date(
                                                                    item.attendance_date
                                                                ).toLocaleDateString()
                                                            }
                                                        </td>

                                                        <td>
                                                            {item.subject_name}
                                                        </td>

                                                        <td>
                                                            {item.subject_code}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={
                                                                    item.status === "Present"
                                                                        ? "status-present"
                                                                        :item.status === "Absent"
                                                                        ? "status-absent"
                                                                        :"status-noclass"
                                                                }

                                                            >
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                    </tr>

                                                ))
                                            }
                                        </tbody>
                                    </table>

                                )
                            }
                        </div>
                    )
                }

                {
                    showMarkModal && (

                        <MarkAttendanceModal
                            subjectId={subjectId}

                            closeModal={() =>
                                setShowMarkModal(false)
                            }

                            refreshAttendance={() => {
                                fetchAttendance();
                                setShowMarkModal(false);
                            }}
                        />
                    )
                }

                {
                    showEditModal && (

                        <EditAttendanceModal
                            subjectId={subjectId}

                            closeModal={() =>
                                setShowEditModal(false)
                            }

                            refreshAttendance={() => {
                                fetchAttendance();
                                setShowEditModal(false);
                            }}
                        />
                    )
                }
            </div>

        </div>
    );
}

export default Attendance;