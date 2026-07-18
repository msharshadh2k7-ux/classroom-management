const pool = require("../config/db");

// Create Poll (CR)
const createPoll = async (req, res) => {

    try {
        const { question, options, end_time } = req.body;

        if (!question || !options || options.length < 2) {
            return res.status(400).json({
                message: "Question and at least 2 options are required"
            });
        }

        const pollResult = await pool.query(
            `INSERT INTO polls
            (
                question,
                created_by,
                end_time,
                classroom_id
            )
            VALUES
            ($1,$2,$3,$4)
            RETURNING *`,
            [
                question,
                req.user.id,
                end_time,
                req.user.classroom_id
            ]
        );

        const pollId = pollResult.rows[0].id;

        for (const option of options) {

            await pool.query(
                `INSERT INTO poll_options
                (
                    poll_id,
                    option_text
                )
                VALUES
                ($1,$2)`,
                [
                    pollId,
                    option
                ]
            );

        }

        res.status(201).json({
            message: "Poll created successfully",
            poll: pollResult.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// View Polls
const getPolls = async (req, res) => {

    try {
        const pollResult = await pool.query(
            `SELECT *
             FROM polls
             WHERE classroom_id = $1
             ORDER BY created_at DESC`,
            [
                req.user.classroom_id
            ]
        );

        for (const poll of pollResult.rows) {

            poll.ended =
                poll.end_time &&
                new Date() > new Date(poll.end_time);

            const optionResult = await pool.query(

                `SELECT
                    po.id,
                    po.option_text,
                    COUNT(v.id)::int AS votes
                 FROM poll_options po
                 LEFT JOIN votes v
                 ON po.id = v.option_id
                 WHERE po.poll_id = $1
                 GROUP BY
                    po.id,
                    po.option_text
                 ORDER BY po.id`,

                [poll.id]

            );

            poll.options = optionResult.rows;

        }

        res.status(200).json(pollResult.rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Vote Poll
const votePoll = async (req, res) => {

    try {
        const { id } = req.params;
        const { option_id } = req.body;
        const user_id = req.user.id;

        // Check Poll
        const pollResult = await pool.query(
            `SELECT *
             FROM polls
             WHERE id = $1
             AND classroom_id = $2`,
            [
                id,
                req.user.classroom_id
            ]
        );

        if (pollResult.rows.length === 0) {
            return res.status(404).json({
                message: "Poll not found"
            });
        }

        const poll = pollResult.rows[0];

        // Check Poll Ended
        if (
            poll.end_time &&
            new Date() > new Date(poll.end_time)
        ) {
            return res.status(400).json({
                message: "Poll has ended"
            });
        }

        // Already voted?
        const voteResult = await pool.query(
            `SELECT *
             FROM votes
             WHERE poll_id = $1
             AND user_id = $2`,
            [
                id,
                user_id
            ]
        );

        if (voteResult.rows.length > 0) {
            return res.status(400).json({
                message: "You have already voted"
            });
        }

        // Option exists?
        const optionResult = await pool.query(
            `SELECT *
             FROM poll_options
             WHERE id = $1
             AND poll_id = $2`,
            [
                option_id,
                id
            ]
        );

        if (optionResult.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid option"
            });
        }

        // Save vote
        const result = await pool.query(
            `INSERT INTO votes
            (
                poll_id,
                option_id,
                user_id
            )
            VALUES
            ($1,$2,$3)
            RETURNING *`,
            [
                id,
                option_id,
                user_id
            ]
        );

        res.status(201).json({
            message: "Vote submitted successfully",
            vote: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Poll Results
const getPollResults = async (req, res) => {

    try {
        const { id } = req.params;

        const pollResult = await pool.query(
            `SELECT *
             FROM polls
             WHERE id = $1
             AND classroom_id = $2`,
            [
                id,
                req.user.classroom_id
            ]
        );

        if (pollResult.rows.length === 0) {
            return res.status(404).json({
                message: "Poll not found"
            });
        }

        const result = await pool.query(
            `SELECT
                po.id,
                po.option_text,
                COUNT(v.id)::int AS votes
             FROM poll_options po
             LEFT JOIN votes v
             ON po.id = v.option_id
             WHERE po.poll_id = $1
             GROUP BY
                po.id,
                po.option_text
             ORDER BY po.id`,
            [id]
        );

        res.status(200).json({
            question: pollResult.rows[0].question,
            end_time: pollResult.rows[0].end_time,
            results: result.rows
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Poll
const deletePoll = async (req, res) => {

    try {
        const { id } = req.params;

        const poll = await pool.query(
            `SELECT *
             FROM polls
             WHERE id = $1
             AND classroom_id = $2`,
            [
                id,
                req.user.classroom_id
            ]
        );

        if (poll.rows.length === 0) {
            return res.status(404).json({
                message: "Poll not found"
            });
        }

        await pool.query(
            `DELETE FROM votes
             WHERE poll_id = $1`,
            [id]
        );

        await pool.query(
            `DELETE FROM poll_options
             WHERE poll_id = $1`,
            [id]
        );

        await pool.query(
            `DELETE FROM polls
             WHERE id = $1`,
            [id]
        );

        res.status(200).json({
            message: "Poll deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Export
module.exports = {
    createPoll,
    getPolls,
    votePoll,
    getPollResults,
    deletePoll
};

