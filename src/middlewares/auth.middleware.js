// middlewares/auth.middleware.js
const { getUserFromToken } = require('../utils/token');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const user = getUserFromToken(token);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.user = user; // ✅ akan berisi: userId, username, roleId, roleName
    next();
};

module.exports = { authMiddleware };
