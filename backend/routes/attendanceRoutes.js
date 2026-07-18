const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isCR = require("../middleware/roleMiddleware");

const {
    getStudents,
    markAttendance,
    getMyAttendance,
    updateAttendance,
    getAttendanceByDate
} = require("../controllers/attendanceController");

// Student + CR List
router.get("/students",verifyToken,isCR,getStudents);

// Student View Attendance
router.get("/:subjectId",verifyToken,getMyAttendance);

// CR Mark Attendance
router.post("/:subjectId/attendance",verifyToken,isCR,markAttendance);

// CR Update Attendance
router.put("/:subjectId/attendance",verifyToken,isCR,updateAttendance);

// CR View Attendance By Date
router.get("/:subjectId/attendance/date",verifyToken,isCR,getAttendanceByDate);

module.exports = router;