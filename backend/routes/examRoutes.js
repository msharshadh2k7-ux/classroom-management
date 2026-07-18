const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isCR = require("../middleware/roleMiddleware");

const {
    createExam,
    getExams,
    updateExam,
    deleteExam
} = require("../controllers/examController");

// Student & CR - View Exams
router.get("/",verifyToken,getExams);

// CR - Create Exam
router.post("/",verifyToken,isCR,createExam);

// CR - Update Exam
router.put("/:examId",verifyToken,isCR,updateExam);

// CR - Delete Exam
router.delete("/:examId",verifyToken,isCR,deleteExam);

module.exports = router;