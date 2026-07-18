const pool = require("../config/db");

// Get Students (CR)
const getStudents = async (req, res) => {

    try {
        const result = await pool.query(
            `SELECT
                id,
                name
             FROM users
             WHERE role IN ('Student','CR')
             AND classroom_id = $1
             ORDER BY name`,
            [req.user.classroom_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// Mark Attendance (CR)
const markAttendance = async (req, res) => {

    try {
        const { subjectId } = req.params;
        const { attendance_date, students } = req.body;

        if (!attendance_date || !students || students.length === 0) {

            return res.status(400).json({
                message: "Attendance date and student list are required."
            });

        }

        // Check subject belongs to current classroom
        const subject = await pool.query(
            `SELECT id
             FROM subjects
             WHERE id = $1
             AND classroom_id = $2`,
            [
                subjectId,
                req.user.classroom_id
            ]
        );

        if (subject.rows.length === 0) {

            return res.status(404).json({
                message: "Subject not found"
            });
        }

        for (const student of students) {

            // Verify student belongs to same classroom
            const user = await pool.query(
                `SELECT id
                 FROM users
                 WHERE id = $1
                 AND classroom_id = $2`,
                [
                    student.user_id,
                    req.user.classroom_id
                ]
            );

            if (user.rows.length === 0) {
                continue;
            }

            // Check whether attendance already exists
            const check = await pool.query(
                `SELECT id
                 FROM attendance
                 WHERE subject_id = $1
                 AND user_id = $2
                 AND attendance_date = $3`,
                [
                    subjectId,
                    student.user_id,
                    attendance_date
                ]
            );

            if (check.rows.length === 0) {

                await pool.query(
                    `INSERT INTO attendance
                    (
                        subject_id,
                        user_id,
                        attendance_date,
                        status
                    )
                    VALUES
                    ($1,$2,$3,$4)`,
                    [
                        subjectId,
                        student.user_id,
                        attendance_date,
                        student.status
                    ]
                );

            } else {
                await pool.query(
                    `UPDATE attendance
                     SET status = $1
                     WHERE subject_id = $2
                     AND user_id = $3
                     AND attendance_date = $4`,
                    [
                        student.status,
                        subjectId,
                        student.user_id,
                        attendance_date
                    ]
                );
            }
        }

        res.status(201).json({
            message: "Attendance marked successfully."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }

};


// Student Attendance
const getMyAttendance = async (req, res) => {

    try {
        const { subjectId } = req.params;

        const result = await pool.query(
            `SELECT
                s.subject_name,
                s.subject_code,
                a.attendance_date,
                a.status
             FROM attendance a
             JOIN subjects s
             ON s.id = a.subject_id
             WHERE
                a.subject_id = $1
                AND a.user_id = $2
                AND s.classroom_id = $3
             ORDER BY a.attendance_date DESC`,
            [
                subjectId,
                req.user.id,
                req.user.classroom_id
            ]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// Update Attendance (CR)
const updateAttendance = async (req, res) => {

    try {
        const { subjectId } = req.params;
        const { attendance_date, students } = req.body;

        if (!attendance_date || !students || students.length === 0) {

            return res.status(400).json({
                message: "Attendance date and students are required."
            });

        }

        // Check subject belongs to current classroom
        const subject = await pool.query(
            `SELECT id
             FROM subjects
             WHERE id = $1
             AND classroom_id = $2`,
            [
                subjectId,
                req.user.classroom_id
            ]
        );

        if (subject.rows.length === 0) {

            return res.status(404).json({
                message: "Subject not found"
            });

        }

        for (const student of students) {

            // Verify student belongs to same classroom
            const user = await pool.query(
                `SELECT id
                 FROM users
                 WHERE id = $1
                 AND classroom_id = $2`,
                [
                    student.id,
                    req.user.classroom_id
                ]
            );

            if (user.rows.length === 0) {
                continue;
            }

            await pool.query(
                `UPDATE attendance
                 SET status = $1
                 WHERE subject_id = $2
                 AND user_id = $3
                 AND attendance_date = $4`,
                [
                    student.status,
                    subjectId,
                    student.id,
                    attendance_date
                ]
            );

        }

        res.status(200).json({
            message: "Attendance updated successfully."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// Attendance By Date (CR)
const getAttendanceByDate = async (req, res) => {

    try {
        const { subjectId } = req.params;
        const { date } = req.query;

        // Check subject belongs to current classroom
        const subject = await pool.query(
            `SELECT id
             FROM subjects
             WHERE id = $1
             AND classroom_id = $2`,
            [
                subjectId,
                req.user.classroom_id
            ]
        );

        if (subject.rows.length === 0) {

            return res.status(404).json({
                message: "Subject not found"
            });

        }

        const result = await pool.query(
            `SELECT
                u.id,
                u.name,
                a.status
             FROM attendance a
             JOIN users u
             ON a.user_id = u.id
             WHERE
                a.subject_id = $1
                AND a.attendance_date = $2
                AND u.classroom_id = $3
             ORDER BY u.name`,
            [
                subjectId,
                date,
                req.user.classroom_id
            ]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// Export
module.exports = {
    getStudents,
    markAttendance,
    getMyAttendance,
    updateAttendance,
    getAttendanceByDate
};