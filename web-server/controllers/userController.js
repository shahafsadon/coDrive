// web-server/controllers/userController.js
const { createUser, findUserByUsername, findUserById } = require('../models/user.model');

// New user registration
const registerUser = (req, res) => {
    const { 
        username, 
        password, 
        fullName, 
        email, 
        phoneNumber, 
        birthDate, 
        image 
    } = req.body;

    // Server Side Validation 
    
    // Check mandatory fields
    if (!username || !password || !fullName) {
        return res.status(400).json({ 
            error: "Missing mandatory fields: username, password, and fullName are required." 
        });
    }

    // Check password length
    if (password.length < 8) {
        return res.status(400).json({ 
            error: "Password must be at least 8 characters long." 
        });
    }

    // Check password complexity (English letters)
    // Regex: checks for at least one English letter (lowercase or uppercase)
    if (!/[a-zA-Z]/.test(password)) {
        return res.status(400).json({ 
            error: "Password must contain at least one English letter." 
        });
    }

    // Check if user already exists
    const existingUser = findUserByUsername(username);
    if (existingUser) {
        return res.status(409).json({ 
            error: "Username already exists." 
        });
    }

    
    // Create new user
    const newUser = createUser({
        username,
        password,
        fullName,
        email,
        phoneNumber,
        birthDate,
        image
    });

    // Respond with created user details (excluding password)
    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.fullName
    });
};

// Fetch user details by ID
const getUserById = (req, res) => {
    const user = findUserById(req.params.id);
    
    // Check if user exists
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Construct user object without password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
};

module.exports = {
    registerUser,
    getUserById
};