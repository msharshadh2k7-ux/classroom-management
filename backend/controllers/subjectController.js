const pool = require("../config/db");

// Create Subject (CR)
const createSubject = async (req, res) => {

    try {
        const { subject_name, subject_code } = req.body;

        if (!subject_name || !subject_code) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO subjects
            (
                subject_name,
                subject_code,
                created_by,
                classroom_id
            )
            VALUES
            ($1,$2,$3,$4)
            RETURNING *`,
            [
                subject_name,
                subject_code,
                req.user.id,
                req.user.classroom_id
            ]
        );

        res.status(201).json({
            message: "Subject created successfully",
            subject: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// View Subjects
const getSubjects = async (req, res) => {

    try {
        const result = await pool.query(
            `SELECT *
             FROM subjects
             WHERE classroom_id = $1
             ORDER BY subject_name`,
            [req.user.classroom_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Subject
const deleteSubject = async (req, res) => {

    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM subjects
             WHERE id = $1
             AND classroom_id = $2
             RETURNING *`,
            [
                id,
                req.user.classroom_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        res.status(200).json({
            message: "Subject deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Subject
const updateSubject = async (req, res) => {

    try {
        const { id } = req.params;
        const { subject_name, subject_code } = req.body;

        const result = await pool.query(
            `UPDATE subjects
             SET subject_name = $1,
                 subject_code = $2
             WHERE id = $3
             AND classroom_id = $4
             RETURNING *`,
            [
                subject_name,
                subject_code,
                id,
                req.user.classroom_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        res.status(200).json({
            message: "Subject updated successfully",
            subject: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createSubject,
    getSubjects,
    deleteSubject,
    updateSubject
};