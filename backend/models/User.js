import mongoose from "mongoose";
import bcrypt from "bcrypt";

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/;
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false,
            validate: {
                validator: function (value) {
                    return passwordRegex.test(value);
                },
                message: "Password must be at least 12 characters and include uppercase, lowercase, number, and special character"
            }
        },
        phone: {
            type: String,
            match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
        },
        privacySettings: {
            showEmail: { type: Boolean, default: false },
            showPhone: { type: Boolean, default: false },
            profileVisible: { type: Boolean, default: true },
        },
        notificationSettings: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true },
        },
        role: {
            type: String,
            enum: ['tenant', 'owner', 'admin'],
            default: 'tenant',
        },
        avatar: String,
        bio: String,
        address: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
