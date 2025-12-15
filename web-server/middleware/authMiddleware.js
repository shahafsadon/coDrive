const { getUserById } = require('../models/user.model');

const authenticateRequest = (req, res, next) => {
    const userId = req.header('x-user-id');

    if (!userId) {
        return res.status(401).json({
            error: 'User is not authenticated',
        });
    }

    const user = getUserById(userId);
    if (!user) {
        return res.status(401).json({
            error: 'User is not authenticated',
        });
    }

    // attach user to request
    req.user = user;
    next();
};

module.exports = authenticateRequest;
