const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isCR = require("../middleware/roleMiddleware");

const {
    createPoll,
    getPolls,
    votePoll,
    getPollResults,
    deletePoll
} = require("../controllers/pollController");

// Student & CR - View Polls
router.get("/", verifyToken, getPolls);

// Student & CR - Vote
router.post("/:id/vote", verifyToken, votePoll);

// Student & CR - View Results
router.get("/:id/results", verifyToken, getPollResults);

// CR - Create Poll
router.post("/", verifyToken, isCR, createPoll);

// CR - Delete Poll
router.delete("/:id", verifyToken, isCR, deletePoll);

module.exports = router;