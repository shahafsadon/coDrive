const {
    createUser,
    findUserByUsername,
    findUserById,
} = require('../models/user.model');
const { AppError } = require('../middleware/errorMiddleware');

// New user registration
const registerUser = async (req, res, next) => {
    const {
        username,
        password,
        fullName,
        email,
        phoneNumber,
        birthDate,
        image,
    } = req.body;

    try {
        // Server Side Validation

        // Check mandatory fields
        if (!username || !password || !fullName) {
            throw new AppError("Missing mandatory fields: username, password, and fullName are required.", 400);
        }

        // Check password length
        if (password.length < 8) {
            throw new AppError("Password must be at least 8 characters long.", 400);
        }

        // Check password complexity (English letters)
        if (!/[a-zA-Z]/.test(password)) {
            throw new AppError("Password must contain at least one English letter.", 400);
        }

        // Check if user already exists
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            throw new AppError("Username already exists.", 409);
        }

        // Create new user
        const newUser = await createUser({
            username,
            password,
            fullName,
            email,
            phoneNumber,
            birthDate,
            image,
        });

        // Respond with created user details (excluding password)
        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            fullName: newUser.fullName,
        });
    } catch (err) {
        next(err);
    }
};

// Fetch user details by ID
const getUserById = async (req, res, next) => {
    try {
        const user = await findUserById(req.params.id);

        // Check if user exists
        if (!user) {
            throw new AppError("User not found", 404);
        }

        // Construct user object without password
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    registerUser,
    getUserById,
};
