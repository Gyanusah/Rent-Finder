import User from "../models/User.js";
import { generateToken } from "../middleware/tokenUtils.js";

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Please provide a name' });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Please provide a valid email' });
        }

        if (!password || !password.trim()) {
            return res.status(400).json({ message: 'Please provide a password' });
        }

        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create user
        user = new User({
            name: name.trim(),
            email: email.toLowerCase(),
            password,
            role: role || 'tenant',
            phone: phone || '',
        });

        await user.save();

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error('Register Error:', error.message, error.stack);
        res.status(400).json({ message: error.message });
    }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate & sanitize
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Please provide a valid email and password' });
        }

        if (!password || !password.trim()) {
            return res.status(400).json({ message: 'Please provide a  email and password' });
        }

        // Check for user
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Email not found. Please register first.' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect email and password. Please try again.' });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error('Login Error:', error.message, error.stack);
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            bio,
            address,
            avatar,
            privacySettings,
            notificationSettings,
        } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (bio) updateData.bio = bio;
        if (address) updateData.address = address;
        if (privacySettings) updateData.privacySettings = privacySettings;
        if (notificationSettings) updateData.notificationSettings = notificationSettings;

        if (req.file?.secure_url || req.file?.url || req.file?.path) {
            updateData.avatar = req.file.secure_url || req.file.url || req.file.path;
        } else if (avatar) {
            updateData.avatar = avatar;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Current password, new password, and confirmation are required.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirmation must match.' });
        }

        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.',
        });
    } catch (error) {
        console.error('Change Password Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/auth/user/:id
// @desc    Get user by id
// @access  Public
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/auth/users
// @desc    Get all users (admin)
// @access  Private (admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
