const {
    createUser,
    findUserByUsername,
} = require('../models/user.model');

// POST /api/users
// NOTE: Password is stored as plain text for now.
// In a real system, it should be hashed.
const registerUser = (req, res) => {
    const { username, password, name, image } = req.body;

    // Validate required fields
    if (!username || !password || !name) {
        return res.status(400).json({
            error: 'username, password and name are required',
        });
    }

    // Check for existing user
    const existingUser = findUserByUsername(username);
    if (existingUser) {
        return res.status(409).json({
            error: 'Username already exists',
        });
    }

    // Create user
    const user = createUser({ username, password, name, image });

    // Return created user (without password ideally, but for now OK)
    return res.status(201).json(user);
};

module.exports = {
    registerUser,
};
