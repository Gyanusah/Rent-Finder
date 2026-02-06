const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, getUserById, getAllUsers } = require('../controllers/authController');
// const { auth, authorize } = require('../middleware/auth');
const { auth, authorize } = require('../middleware/auth');

// Debug route to test server
router.get('/debug', (req, res) => {
    res.status(200).json({
        message: 'Auth routes working',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/user/:id', getUserById);

// Protected routes
router.get('/me', auth, getMe);
router.put('/update-profile', auth, updateProfile);

// Admin: list users
router.get('/users', auth, authorize('admin'), getAllUsers);

module.exports = router;
