const jwt = require('jsonwebtoken');

exports.adminAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    console.log(token)
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
