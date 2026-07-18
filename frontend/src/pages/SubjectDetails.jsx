import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/subjectDetails.css";

function SubjectDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubject();
    }, []);

    const fetchSubject = async () => {

        try {
            const response = await api.get("/subjects");

            const selected = response.data.find(
                (sub) => sub.id === Number(id)
            );

            setSubject(selected);
        }

        catch (error) {
            console.log(error);
        }

        finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!subject) {
        return <h2>Subject Not Found</h2>;
    }

    return (
        <div className="dashboard">

            <Sidebar />

            <div className="dashboard-content">
                <button
                    className="back-btn"
                    onClick={() => navigate("/subjects")}
                >
                    ← Back
                </button>
                <div className="subject-header">

                    <h1>{subject.subject_name}</h1>

                    <p>
                        Subject Code :
                        <b>
                            {subject.subject_code}
                        </b>
                    </p>
                </div>

                <div className="details-grid">
                    <div
                        className="detail-card"
                        onClick={() =>
                            navigate(`/attendance/${id}`)
                        }
                    >

                        <i className="bi bi-calendar-check"></i>

                        <h3>Attendance</h3>
                        <p>
                            View & Manage Attendance
                        </p>
                    </div>

                    <div
                        className="detail-card"
                        onClick={() =>
                            navigate(`/notes/${id}`)
                        }
                    >
                        <i className="bi bi-file-earmark-text"></i>

                        <h3>Notes</h3>

                        <p>
                            Upload & Download Notes
                        </p>
                    </div>

                </div>

            </div>

        </div>

    );

}

export default SubjectDetails;