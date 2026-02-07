import express from "express";
const router = express.Router();
import { register, login, getMe, updateProfile, getUserById, getAllUsers } from "../controllers/authController.js";
import { auth, authorize } from "../middleware/auth.js";

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

export default router;
