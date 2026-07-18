const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isCR = require("../middleware/roleMiddleware");

const {
    getNotes,
    uploadNote,
    deleteNote,
    downloadNote
} = require("../controllers/noteController");

const upload = require("../config/multerConfig");

// View Notes
router.get("/:subjectId", verifyToken, getNotes);

// Upload Note
router.post("/:subjectId",verifyToken,isCR,upload.single("file"),uploadNote);

// Delete Note
router.delete(
    "/:noteId",
    verifyToken,
    isCR,
    deleteNote
);

// Download Note
router.get(
    "/download/:noteId",
    verifyToken,
    downloadNote
);

module.exports = router;