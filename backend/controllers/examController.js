const pool = require("../config/db");

// Create Exam (CR)
const createExam = async (req, res) => {

    try {

        const {
            subject_id,
            exam_name,
            exam_date,
            exam_time,
            venue,
            maximum_marks,
            portion
        } = req.body;

        if (
            !subject_id ||
            !exam_name ||
            !exam_date ||
            !exam_time ||
            !venue ||
            !maximum_marks ||
            !portion
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO exams
            (
                subject_id,
                exam_name,
                exam_date,
                exam_time,
                venue,
                maximum_marks,
                portion,
                created_by,
                classroom_id
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *`,
            [
                subject_id,
                exam_name,
                exam_date,
                exam_time,
                venue,
                maximum_marks,
                portion,
                req.user.id,
                req.user.classroom_id
            ]
        );

        res.status(201).json({
            message: "Exam created successfully",
            exam: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// View Exams
const getExams = async (req, res) => {

    try {
        const result = await pool.query(
            `SELECT
                e.id,
                s.subject_name,
                e.exam_name,
                e.exam_date,
                e.exam_time,
                e.venue,
                e.maximum_marks,
                e.portion
             FROM exams e
             JOIN subjects s
             ON e.subject_id = s.id
             WHERE e.classroom_id = $1
             ORDER BY e.exam_date ASC`,
            [req.user.classroom_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Exam
const updateExam = async (req, res) => {

    try {
        const { examId } = req.params;

        const {
            exam_name,
            exam_date,
            exam_time,
            venue,
            maximum_marks,
            portion
        } = req.body;

        const result = await pool.query(
            `UPDATE exams
             SET
                exam_name = $1,
                exam_date = $2,
                exam_time = $3,
                venue = $4,
                maximum_marks = $5,
                portion = $6
             WHERE id = $7
             AND classroom_id = $8
             RETURNING *`,
            [
                exam_name,
                exam_date,
                exam_time,
                venue,
                maximum_marks,
                portion,
                examId,
                req.user.classroom_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        res.status(200).json({
            message: "Exam updated successfully",
            exam: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// Delete Exam
const deleteExam = async (req, res) => {

    try {
        const { examId } = req.params;

        const result = await pool.query(
            `DELETE FROM exams
             WHERE id = $1
             AND classroom_id = $2
             RETURNING *`,
            [
                examId,
                req.user.classroom_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        res.status(200).json({
            message: "Exam deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createExam,
    getExams,
    updateExam,
    deleteExam
};