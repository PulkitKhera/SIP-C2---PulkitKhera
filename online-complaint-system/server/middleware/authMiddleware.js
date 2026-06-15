// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get the token from the request header
    const token = req.header('Authorization');

    // If there is no token, deny access
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        // Verify the token (Handles 'Bearer <token>' format)
        const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        // Attach the user info (id, role) from the payload to the request object
        req.user = decoded.user;
        next(); // Move on to the controller
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid or has expired' });
    }
};