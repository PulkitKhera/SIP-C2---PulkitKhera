// server/middleware/adminMiddleware.js

module.exports = function (req, res, next) {
    // authMiddleware runs before this, so req.user is already available
    if (req.user && req.user.role === 'Admin') {
        next(); // User is an admin, proceed to the controller
    } else {
        res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
};