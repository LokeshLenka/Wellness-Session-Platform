const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // First verify the token format
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);

        // Then check if token exists in database and is not expired
        const storedToken = await Token.findOne({ 
            token: token,
            user: decoded.user.id,
            expiresAt: { $gt: new Date() }
        });

        if (!storedToken) {
            return res.status(401).json({ message: 'Token has been revoked or expired.' });
        }

        req.user = decoded.user;
        req.token = storedToken;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired.' });
        }
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;