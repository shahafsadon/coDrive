const {
    createUser,
    findUserByUsername,
    findUserById,
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

    // Exclude password from response
    const { password: _, ...safeUser } = user;
    return res.status(201).json(safeUser);
};

// GET /api/users/:id
const getUserById = (req, res) => {
    const { id } = req.params;

    const user = findUserById(id);
    if (!user) {
        return res.status(404).json({
            error: 'User not found',
        });
    }

    // Exclude password
    const { password, ...safeUser } = user;
    return res.status(200).json(safeUser);
};

module.exports = {
    registerUser,
    getUserById,
};
