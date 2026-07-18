const jwt = require("jsonwebtoken");

// Verify JWT Token
const verifyToken = (req, res, next) => {

    try {
        // Get Authorization Header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader) {
            return res.status(401).json({
                message: "Access Denied. No Token Provided."
            });
        }

        // Expected Format:
        // Bearer eyJhbGciOiJIUzI1NiIs...
        const token = authHeader.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user details
        req.user = decoded;

        // Go to next middleware
        next();

    }
    catch (error) {

        console.error(error);

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({
                message: "Session Expired. Please login again."
            });

        }

        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};

module.exports = verifyToken;