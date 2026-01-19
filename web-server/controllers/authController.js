const jwt = require('jsonwebtoken');
const { findUserByUsername } = require('../models/user.model');
const { AppError } = require('../middleware/errorMiddleware');

// POST /api/tokens
const authenticateUser = async (req, res, next) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return next(new AppError('Username and password are required', 400));
    }

    // Find user
    const user = await findUserByUsername(username);
    if (!user || user.password !== password) {
        return next(new AppError('Invalid credentials', 401));
    }

    // CREATE JWT
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Successful authentication
    return res.status(200).json({
        userId: user.id,
        token,
    });
};

module.exports = {
    authenticateUser,
};
