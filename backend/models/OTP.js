import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['email', 'phone', 'both'],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for cleanup and lookup
OTPSchema.index({ email: 1, type: 1 });
OTPSchema.index({ phone: 1, type: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('OTP', OTPSchema);
