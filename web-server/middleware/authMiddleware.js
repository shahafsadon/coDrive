module.exports = (req, res, next) => {
    const userId = req.header('x-user-id');

    if (!userId) {
        return res.status(401).json({ error: 'User is not authenticated' });
    }

    req.user = { id: userId };
    next();
};
