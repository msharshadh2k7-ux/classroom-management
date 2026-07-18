const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Signup
const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            department,
            year,
            section
        } = req.body;

        // Check required fields
        if (
            !name ||
            !email ||
            !password ||
            !department ||
            !year ||
            !section
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check existing user
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Find classroom
        const classroom = await pool.query(
            `SELECT id
             FROM classrooms
             WHERE department = $1
             AND year = $2
             AND section = $3`,
            [department, year, section]
        );

        if (classroom.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid Department / Year / Section"
            });
        }

        const classroomId = classroom.rows[0].id;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const role = "Student";

        // Insert user
        const newUser = await pool.query(
            `INSERT INTO users
            (
                name,
                email,
                password,
                role,
                department,
                year,
                section,
                classroom_id
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING
            id,
            name,
            email,
            role,
            classroom_id`,
            [
                name,
                email,
                hashedPassword,
                role,
                department,
                year,
                section,
                classroomId
            ]
        );

        // Generate JWT
        const token = jwt.sign(
            {
                id: newUser.rows[0].id,
                role: newUser.rows[0].role,
                classroom_id: newUser.rows[0].classroom_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            role: newUser.rows[0].role,
            name: newUser.rows[0].name
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// Login
const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.rows[0].id,
                role: user.rows[0].role,
                classroom_id: user.rows[0].classroom_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            role: user.rows[0].role,
            name: user.rows[0].name
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// Profile
const getProfile = async (req, res) => {

    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                role,
                department,
                year,
                section,
                classroom_id
             FROM users
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    signup,
    login,
    getProfile
};