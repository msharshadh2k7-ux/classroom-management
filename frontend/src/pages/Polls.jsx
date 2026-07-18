import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CreatePollModal from "../components/CreatePollModal";
import api from "../services/api";
import "../styles/polls.css";

function Polls() {

    // User Role
    const role = localStorage.getItem("role");

    // States
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    // Fetch Polls
    const fetchPolls = async () => {

        try {
            const response = await api.get("/polls");
            setPolls(response.data);
        }

        catch (error) {
            console.error(error);
            setError("Unable to load polls.");
        }

        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls();
    }, []);

    // Vote
    const votePoll = async (pollId, optionId) => {
        try {
            await api.post(
                `/polls/${pollId}/vote`,
                {
                    option_id: optionId
                }
            );
            alert("Vote submitted successfully.");
            fetchPolls();
        }

        catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to vote."
            );
        }
    };

    // Delete Poll
    const deletePoll = async (pollId) => {

        if (!window.confirm("Delete this poll?")) {
            return;
        }

        try {
            await api.delete(`/polls/${pollId}`);
            fetchPolls();
        }

        catch (error) {
            alert(
                error.response?.data?.message ||
                "Delete failed."
            );
        }
    };

    // =============================
    // JSX
    // =============================

    return (
        <div className="dashboard">

            <Sidebar />

            <div className="dashboard-content">

                {/* Header */}

                <div className="poll-header">

                    <div>
                        <h2>
                            📊 Classroom Polls
                        </h2>

                        <p>
                            Vote and participate in classroom decisions.
                        </p>
                    </div>

                    {
                        role === "CR" && (
                            <button
                                className="create-poll-btn"
                                onClick={() => setShowModal(true)}
                            >
                                + Create Poll
                            </button>
                        )
                    }
                </div>

                {/* Loading */}

                {
                    loading && (
                        <div className="loading">
                            Loading Polls...
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

                {/* Poll Grid */}

                {
                    !loading && !error && (

                        <div className="poll-grid">
                            {
                                polls.length === 0 ?

                                (
                                    <div className="empty-poll">
                                        <h3>
                                            No Polls Available
                                        </h3>
                                    </div>
                                )
                                :
                                (
                                    polls.map((poll) => {

                                        const isEnded = poll.ended;
                                        const totalVotes = poll.options.reduce(

                                            (sum, option) =>
                                                sum + Number(option.votes),
                                            0
                                        );

                                        return (
                                            <div
                                                key={poll.id}
                                                className={`poll-card ${isEnded ? "poll-ended" : ""}`}
                                            >

                                                <h3>
                                                    {poll.question}
                                                </h3>

                                                <small>

                                                    Ends :

                                                    {" "}

                                                    {
                                                        new Date(
                                                            poll.end_time
                                                        ).toLocaleString()
                                                    }

                                                </small>

                                                <hr />

                                                <div className="poll-options">

                                                    {
                                                        poll.options.map((option) => (
                                                            isEnded ?

                                                            (
                                                                <div
                                                                    key={option.id}
                                                                    className="result-option"
                                                                >

                                                                    <div className="result-header">
                                                                        <span>
                                                                            {option.option_text}
                                                                        </span>

                                                                        <span>
                                                                            {option.votes} Votes
                                                                        </span>
                                                                    </div>

                                                                    <div className="progress">

                                                                        <div
                                                                            className="progress-fill"

                                                                            style={{

                                                                                width:

                                                                                    totalVotes > 0
                                                                                        ?
                                                                                        `${(Number(option.votes) / totalVotes) * 100}%`
                                                                                        :
                                                                                        "0%"
                                                                            }}
                                                                        ></div>

                                                                    </div>
                                                                </div>
                                                            )
                                                            :
                                                            (
                                                                <button
                                                                    key={option.id}
                                                                    className="option-btn"

                                                                    onClick={() =>
                                                                        votePoll(
                                                                            poll.id,
                                                                            option.id
                                                                        )
                                                                    }
                                                                >

                                                                    {
                                                                        option.option_text
                                                                    }
                                                                </button>
                                                            )
                                                        ))
                                                    }
                                                </div>

                                                {/* Actions */}

                                                <div className="poll-actions">
                                                    {
                                                        role === "CR" && (

                                                            <button
                                                                className="delete-btn"
                                                                onClick={() =>
                                                                    deletePoll(
                                                                        poll.id
                                                                    )
                                                                }
                                                            >
                                                                🗑 Delete
                                                            </button>
                                                        )
                                                    }
                                                </div>

                                                {/* Poll Ended Badge */}

                                                {
                                                    isEnded && (

                                                        <div className="poll-ended-text">
                                                            🔒 Poll Ended
                                                        </div>
                                                    )
                                                }

                                                {/* Total Votes */}

                                                {
                                                    isEnded && (

                                                        <div className="total-votes">
                                                            Total Votes :
                                                            {" "}
                                                            {totalVotes}
                                                        </div>
                                                    )
                                                }
                                            </div>

                                        );
                                    })
                                )
                            }
                        </div>
                    )

                }

                {/* Create Poll Modal */}

                {

                    showModal && (

                        <CreatePollModal

                            closeModal={() =>
                                setShowModal(false)
                            }

                            fetchPolls={() => {
                                fetchPolls();
                                setShowModal(false);
                            }}
                        />

                    )
                }
            </div>

        </div>
    );
}

export default Polls;