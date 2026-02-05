require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

// Simple CLI helper to parse --key=value args
const parseArgs = () => {
    const args = process.argv.slice(2);
    const result = {};
    args.forEach((arg) => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.slice(2).split('=');
            result[key] = value;
        }
    });
    return result;
};

const run = async () => {
    const args = parseArgs();
    const name = args.name || process.env.ADMIN_NAME || 'Admin User';
    const email = (args.email || process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
    const password = args.password || process.env.ADMIN_PASSWORD || 'password123';
    const phone = args.phone || process.env.ADMIN_PHONE || '';

    try {
        await connectDB();

        const existing = await User.findOne({ email });
        if (existing) {
            console.log(`Admin with email ${email} already exists (id: ${existing._id}).`);
            process.exit(0);
        }

        const user = new User({ name, email, password, role: 'admin', phone });
        await user.save();

        console.log('✅ Admin user created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin user:', err.message || err);
        process.exit(1);
    }
};

run();
