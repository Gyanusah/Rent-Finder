const User = require('../models/User');
const { generateToken } = require('../middleware/tokenUtils');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
exports.register = async (req, res) => {
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
        res.status(400).json({ message: error.message });
    }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate & sanitize
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Please provide a valid email' });
        }

        if (!password || !password.trim()) {
            return res.status(400).json({ message: 'Please provide a password' });
        }

        // Check for user
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Email not found. Please register first.' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
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
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
exports.getMe = async (req, res) => {
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
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, bio, address, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                name,
                phone,
                bio,
                address,
                avatar,
            },
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

// @route   GET /api/auth/user/:id
// @desc    Get user by id
// @access  Public
exports.getUserById = async (req, res) => {
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
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
