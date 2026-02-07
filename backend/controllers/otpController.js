import OTPModel from "../models/OTP.js";
import { generateOTP, sendEmailOTP as sendEmail } from "../services/emailService.js";
import { generateOTP as generateSMSOTP, sendSMSOTP } from "../services/smsService.js";

// @route   POST /api/otp/send/email
// @desc    Send OTP to email
// @access  Public
export const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTPModel.deleteMany({ email, type: 'email' });

    // Save new OTP
    const newOTP = new OTPModel({
      email,
      otp,
      type: 'email',
    });

    await newOTP.save();

    // Send OTP via email
    const emailResult = await sendEmail(email, otp);

    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send email OTP' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Error sending email OTP:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/otp/send/phone
// @desc    Send OTP to phone
// @access  Public
export const sendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Generate OTP
    const otp = generateSMSOTP();

    // Delete any existing OTP for this phone
    await OTPModel.deleteMany({ phone, type: 'phone' });

    // Save new OTP
    const newOTP = new OTPModel({
      phone,
      otp,
      type: 'phone',
    });

    await newOTP.save();

    // Send OTP via SMS
    const smsResult = await sendSMSOTP(phone, otp);

    if (!smsResult.success) {
      return res.status(500).json({ message: 'Failed to send SMS OTP' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your phone',
    });
  } catch (error) {
    console.error('Error sending phone OTP:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/otp/send/both
// @desc    Send OTP to both email and phone
// @access  Public
export const sendBothOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ message: 'Both email and phone are required' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for both email and phone
    await OTPModel.deleteMany({
      $or: [
        { email, type: 'email' },
        { phone, type: 'phone' }
      ]
    });

    // Save new OTP
    const newOTP = new OTPModel({
      email,
      phone,
      otp,
      type: 'both',
    });

    await newOTP.save();

    // Send OTP via email and SMS
    const [emailResult, smsResult] = await Promise.all([
      sendEmail(email, otp),
      sendSMSOTP(phone, otp)
    ]);

    if (!emailResult.success || !smsResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email and phone',
    });
  } catch (error) {
    console.error('Error sending both OTP:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/otp/verify
// @desc    Verify OTP
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp, type } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    // Find OTP record
    let otpRecord;
    if (email) {
      otpRecord = await OTPModel.findOne({ email, otp, type: type || 'email' });
    } else if (phone) {
      otpRecord = await OTPModel.findOne({ phone, otp, type: type || 'phone' });
    }

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if OTP is expired (10 minutes)
    const createdAt = new Date(otpRecord.createdAt);
    const expiresAt = new Date(createdAt.getTime() + 10 * 60 * 1000);

    if (new Date() > expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: error.message });
  }
};
