const pool = require("../config/db");

// Create Announcement (CR)
const createAnnouncement = async (req, res) => {

    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO announcements
            (
                title,
                body,
                created_by,
                classroom_id
            )
            VALUES
            ($1,$2,$3,$4)
            RETURNING *`,
            [
                title,
                description,
                req.user.id,
                req.user.classroom_id
            ]
        );

        res.status(201).json({
            message: "Announcement created successfully",
            announcement: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }

};

// View Announcements
const viewAnnouncement = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM announcements
             WHERE classroom_id = $1
             ORDER BY created_at DESC`,
            [req.user.classroom_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }

};

// ===============================
// Delete Announcement
// ===============================
const deleteAnnouncement = async (req, res) => {

    try {
        const { announcementId } = req.params;

        const result = await pool.query(
            `DELETE FROM announcements
             WHERE id = $1
             AND classroom_id = $2
             RETURNING *`,
            [
                announcementId,
                req.user.classroom_id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Announcement not found"
            });

        }

        res.status(200).json({
            message: "Announcement deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Update Announcement
const updateAnnouncement = async (req, res) => {

    try {
        const { announcementId } = req.params;
        const { title, description } = req.body;

        const result = await pool.query(
            `UPDATE announcements
             SET title = $1,
                 body = $2
             WHERE id = $3
             AND classroom_id = $4
             RETURNING *`,
            [
                title,
                description,
                announcementId,
                req.user.classroom_id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Announcement not found"
            });

        }

        res.status(200).json({
            message: "Announcement updated successfully",
            announcement: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createAnnouncement,
    viewAnnouncement,
    deleteAnnouncement,
    updateAnnouncement
};