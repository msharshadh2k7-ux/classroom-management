import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UploadNoteModal from "../components/UploadNoteModal";
import api from "../services/api";
import "../styles/notes.css";

function Notes() {

    // Subject ID
    const { subjectId } = useParams();

    // User Role
    const role = localStorage.getItem("role");

    // States
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Fetch Notes
    const fetchNotes = async () => {
        try {
            const response = await api.get(
                `/notes/${subjectId}`
            );
            setNotes(response.data);
        }

        catch (err) {
            console.error(err);
            setError("Unable to load notes.");
        }

        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [subjectId]);

// Download Note
const downloadNote = async (noteId, fileName) => {

    try {
        const response = await api.get(
            `/notes/download/${noteId}`,
            {
                responseType: "blob"
            }
        );

        const url = window.URL.createObjectURL(
            new Blob([response.data])
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }

    catch (err) {
        console.error(err);
        alert(
            err.response?.data?.message ||
            "Unable to download note."
        );
    }
};

    // Delete Note
    const deleteNote = async (noteId) => {
        if (!window.confirm("Delete this note?")) {
            return;
        }

        try {
            await api.delete(`/notes/${noteId}`);
            fetchNotes();
        }

        catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to delete note."
            );
        }
    };

    // JSX
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="dashboard-content">

                {/* Header */}

                <div className="notes-header">
                    <div className="notes-title">
                        <h2>📄 Notes</h2>
                        <p>
                            Access and download study materials.
                        </p>
                    </div>

                    {
                        role === "CR" && (
                            <button
                                className="upload-note-btn"
                                onClick={() =>
                                    setShowModal(true)
                                }
                            >
                                + Upload Note
                            </button>
                        )
                    }
                </div>

                {/* Loading */}

                {
                    loading && (
                        <div className="loading">
                            Loading Notes...
                        </div>
                    )
                }

                {/* Error */}

                {
                    error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )
                }

                {/* Notes */}

                {
                    !loading && !error && (
                        <div className="notes-grid">

                            {
                                notes.length === 0 ?
                                (
                                    <div className="empty-card">
                                        <h3>
                                            No Notes Uploaded
                                        </h3>
                                    </div>
                                )
                                :
                                (
                                    notes.map((note) => (
                                        <div
                                            className="note-card"
                                            key={note.id}
                                        >

                                            <div className="note-top">
                                                <h3>
                                                    {note.title}
                                                </h3>
                                            </div>

                                            <div className="note-details">
                                                <p>
                                                    <strong>File :</strong>
                                                    {" "}
                                                    {note.file_name}
                                                </p>

                                                <p>
                                                    <strong>Uploaded By :</strong>
                                                    {" "}
                                                    {note.uploaded_by}
                                                </p>

                                                <p>
                                                    <strong>Uploaded On :</strong>
                                                    {" "}
                                                    {
                                                        new Date(
                                                            note.uploaded_at
                                                        ).toLocaleString()
                                                    }
                                                </p>
                                            </div>

                                            <div className="note-actions">
                                                <button
                                                    className="download-btn"
                                                    onClick={() =>
                                                        downloadNote(
                                                            note.id,
                                                            note.file_name
                                                        )
                                                    }
                                                >
                                                    ⬇ Download

                                                </button>
                                                {
                                                    role === "CR" && (

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                deleteNote(
                                                                    note.id
                                                                )
                                                            }
                                                        >
                                                            🗑 Delete
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    )
                }

                {/* Upload Note Modal */}

                {
                    showModal && (

                        <UploadNoteModal
                            subjectId={subjectId}

                            closeModal={() =>
                                setShowModal(false)
                            }

                            fetchNotes={() => {
                                fetchNotes();
                                setShowModal(false);
                            }}
                        />
                    )
                }
            </div>

        </div>
    );
}

export default Notes;