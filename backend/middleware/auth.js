// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];

//         if (!token) {
//             return res.status(401).json({ message: 'No token, authorization denied' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// };

// const authorize = (...roles) => (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//         return res.status(403).json({ message: 'Not authorized to access this route' });
//     }
//     next();
// };

// module.exports = { auth, authorize };


const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET missing');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id || decoded.userId || decoded._id;

        if (!userId) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        req.user = { id: userId, role: decoded.role || 'user' };
        next();
    } catch (error) {
        console.error("AUTH ERROR:", error.message);
        return res.status(401).json({ message: 'Token invalid' });
    }
};

const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    next();
};

module.exports = { auth, authorize };
