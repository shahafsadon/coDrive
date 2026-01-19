const jwt = require("jsonwebtoken");
const { AppError } = require('./errorMiddleware');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("[AUTH] Missing or invalid Authorization header:", authHeader);
        return next(new AppError("User is not authenticated", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.userId };
        console.log("[AUTH] Token verified for user:", payload.userId);
        next();
    } catch (err) {
        console.log("[AUTH] Token verification failed:", err.message);
        return next(err);
    }
};

module.exports = {
    authMiddleware,
};
