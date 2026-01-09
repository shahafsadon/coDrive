const jwt = require('jsonwebtoken');
const { findUserByUsername } = require('../models/user.model');

// POST /api/tokens
const authenticateUser = (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({
            error: 'username and password are required',
        });
    }

    // Find user
    const user = findUserByUsername(username);
    if (!user || user.password !== password) {
        return res.status(401).json({
            error: 'Invalid credentials',
        });
    }

    //  CREATE JWT
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'secret',
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
