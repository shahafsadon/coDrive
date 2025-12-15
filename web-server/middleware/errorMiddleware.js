function errorHandler(err, req, res, next) {
    // Invalid JSON body
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'Invalid JSON format',
        });
    }

    // Fallback
    return res.status(500).json({
        error: 'Internal server error',
    });
}

module.exports = errorHandler;
