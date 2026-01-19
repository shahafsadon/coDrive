// Custom Error class with HTTP status codes
class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}

function errorMiddleware(err, req, res, next) {
    // Handle custom AppError
    if (err instanceof AppError) {
        return res.status(err.status).json({
            error: err.message
        });
    }

    // Handle validation errors (e.g., from multer, mongoose)
    if (err.status === 400 || err.name === 'ValidationError') {
        return res.status(400).json({
            error: err.message || 'Validation error'
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired'
        });
    }

    // Default: Internal Server Error
    console.error('Unhandled error:', err);
    return res.status(500).json({
        error: 'Internal server error'
    });
}

module.exports = {
    errorMiddleware,
    AppError
};
