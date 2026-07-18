const express= require("express");
const router = express.Router();

const{signup,login,getProfile} = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

//Signup Route
router.post("/signup",signup);

//Login Route
router.post("/login",login);

// Protected Routes
router.get("/profile",verifyToken,getProfile);

module.exports = router
