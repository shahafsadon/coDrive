// In-memory users store
const users = [];

// Simple unique ID generator
const generateUserId = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
};

// Create a new user object
const createUser = ({ username, password, name, image = null }) => {
    const user = {
        id: generateUserId(),
        username,
        password,
        name,
        image,
    };

    users.push(user);
    return user;
};

// Find user by username
const findUserByUsername = (username) => {
    return users.find((u) => u.username === username);
};

// Find user by id
const findUserById = (id) => {
    return users.find((u) => u.id === id);
};

// Expose users only if needed later (read-only usage)
const getAllUsers = () => {
    return [...users];
};

module.exports = {
    createUser,
    findUserByUsername,
    findUserById,
    getAllUsers,
};
