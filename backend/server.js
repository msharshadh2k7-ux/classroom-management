const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database
require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const pollRoutes = require("./routes/pollRoutes");
const notesRoutes = require("./routes/notesRoutes");
const examRoutes = require("./routes/examRoutes");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/exams", examRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Classroom Management Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});