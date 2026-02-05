const OTP = require('../models/OTP');
const { generateOTP, sendEmailOTP } = require('../services/emailService');
const { generateOTP: generateSMSOTP, sendSMSOTP } = require('../services/smsService');

// @route   POST /api/otp/send/email
// @desc    Send OTP to email
// @access  Public
exports.sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email, type: 'email' });

    // Save new OTP
    const newOTP = new OTP({
      email,
      otp,
      type: 'email',
    });

    await newOTP.save();

    // Send OTP via email
    const emailResult = await sendEmailOTP(email, otp);

    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      // Return OTP for test service
      otp: emailResult.otp || undefined,
      previewUrl: emailResult.previewUrl || undefined,
    });
  } catch (error) {
    console.error('Error sending email OTP:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/otp/send/phone
// @desc    Send OTP to phone
// @access  Public
exports.sendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Generate OTP
    const otp = generateSMSOTP();

    // Delete any existing OTP for this phone
    await OTP.deleteMany({ phone, type: 'phone' });

    // Save new OTP
    const newOTP = new OTP({
      phone,
      otp,
      type: 'phone',
    });

    await newOTP.save();

    // Send OTP via SMS
    const smsResult = await sendSMSOTP(phone, otp);

    if (!smsResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP SMS' });
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
exports.sendBothOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ message: 'Both email and phone are required' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email/phone
    await OTP.deleteMany({
      $or: [
        { email, type: 'both' },
        { phone, type: 'both' }
      ]
    });

    // Save new OTP
    const newOTP = new OTP({
      email,
      phone,
      otp,
      type: 'both',
    });

    await newOTP.save();

    // Send OTP via email and SMS
    const [emailResult, smsResult] = await Promise.all([
      sendEmailOTP(email, otp),
      sendSMSOTP(phone, otp),
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
exports.verifyOTP = async (req, res) => {
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
      otpRecord = await OTP.findOne({ email, otp, type: type || 'email' });
    } else if (phone) {
      otpRecord = await OTP.findOne({ phone, otp, type: type || 'phone' });
    }

    if (!otpRecord) {
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
