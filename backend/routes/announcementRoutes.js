const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isCR = require("../middleware/roleMiddleware");

const {
    viewAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} = require("../controllers/announcementController");

// View Announcements
router.get("/", verifyToken, viewAnnouncement);

// Create Announcement
router.post("/", verifyToken, isCR, createAnnouncement);

// Update Announcement
router.put("/:announcementId", verifyToken, isCR, updateAnnouncement);

// Delete Announcement
router.delete("/:announcementId", verifyToken, isCR, deleteAnnouncement);

module.exports = router;