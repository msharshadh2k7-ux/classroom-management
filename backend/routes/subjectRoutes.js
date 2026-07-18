const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isCR = require("../middleware/roleMiddleware");

const {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

// Student & CR
router.get("/", verifyToken, getSubjects);

// CR Only
router.post("/", verifyToken, isCR, createSubject);

// CR Only
router.put("/:id", verifyToken, isCR, updateSubject);

// CR Only
router.delete("/:id", verifyToken, isCR, deleteSubject);

module.exports = router;