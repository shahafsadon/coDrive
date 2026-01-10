// web-server/models/user.model.js

// In-memory DB
const users = [];

const generateUserId = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
};

// Create new user
const createUser = ({ username, password, fullName, email, phoneNumber, birthDate, image }) => {
    const user = {
        id: generateUserId(),
        username,
        password,    
        fullName,
        email: email || "",
        phoneNumber: phoneNumber || "",
        birthDate: birthDate || "",
        image: image || null 
    };

    users.push(user);
    return user;
};

// Find user by username
const findUserByUsername = (username) => {
    return users.find((u) => u.username === username);
};

// Find user by ID
const findUserById = (id) => {
    return users.find((u) => u.id === id);
};

module.exports = {
    createUser,
    findUserByUsername,
    findUserById
};