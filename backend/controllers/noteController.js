const pool = require("../config/db");
const fs = require("fs");

// Upload Note (CR)
const uploadNote = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a file"
            });
        }

        const result = await pool.query(
            `INSERT INTO notes
            (
                subject_id,
                title,
                file_name,
                file_path,
                uploaded_by,
                classroom_id
            )
            VALUES
            ($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [
                subjectId,
                title,
                req.file.originalname,
                req.file.path,
                req.user.id,
                req.user.classroom_id
            ]
        );

        res.status(201).json({
            message: "Note uploaded successfully",
            note: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// View Notes
const getNotes = async (req, res) => {

    try {
        const { subjectId } = req.params;

        const result = await pool.query(
            `SELECT
                n.id,
                n.title,
                n.file_name,
                u.name AS uploaded_by,
                n.uploaded_at
             FROM notes n
             JOIN users u
             ON n.uploaded_by = u.id
             WHERE
                n.subject_id = $1
                AND n.classroom_id = $2
             ORDER BY n.uploaded_at DESC`,
            [
                subjectId,
                req.user.classroom_id
            ]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Download Note
const downloadNote = async (req, res) => {

    try {
        const { noteId } = req.params;

        const result = await pool.query(
            `SELECT
                file_name,
                file_path
             FROM notes
             WHERE
                id = $1
                AND classroom_id = $2`,
            [
                noteId,
                req.user.classroom_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        const note = result.rows[0];

        res.download(
            note.file_path,
            note.file_name
        );

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Delete Note
const deleteNote = async (req, res) => {

    try {
        const { noteId } = req.params;

        const result = await pool.query(
            `SELECT
                file_path
             FROM notes
             WHERE
                id = $1
                AND classroom_id = $2`,
            [
                noteId,
                req.user.classroom_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        const filePath = result.rows[0].file_path;

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await pool.query(
            `DELETE FROM notes
             WHERE
                id = $1
                AND classroom_id = $2`,
            [
                noteId,
                req.user.classroom_id
            ]
        );

        res.status(200).json({
            message: "Note deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    uploadNote,
    getNotes,
    downloadNote,
    deleteNote
};