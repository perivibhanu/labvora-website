import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token and attach user to request
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header or cookies
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please log in.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User not found or deactivated.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Token invalid or expired.'
        });
    }
};

// Restrict to admin role
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
    });
};
