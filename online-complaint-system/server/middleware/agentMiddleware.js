// server/middleware/agentMiddleware.js

module.exports = function (req, res, next) {
    if (req.user && req.user.role === 'Agent') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Agent privileges required' });
    }
};