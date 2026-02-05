const nodemailer = require('nodemailer');
const { sendTestEmailOTP } = require('./simpleEmail');

// Create a transporter (using Gmail for example)
let transporter;

// Check if email credentials are available
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Use test email service for development
  console.warn('⚠️  Email credentials not configured. Using test email service.');
  console.log('📧 To setup real emails, see SETUP_EMAIL.md');
  console.log('🔍 For now, emails will be sent via test service (viewable in browser)');
  transporter = {
    sendMail: async (options) => {
      const otp = options.html?.match(/(\d{6})/)?.[1] || 'N/A';
      const result = await sendTestEmailOTP(options.to, otp);
      return { messageId: 'test-message-id', ...result };
    }
  };
}

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendEmailOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Rent Finder - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="font-size: 18px; margin: 0;">Your verification code is:</p>
            <h1 style="font-size: 36px; color: #007bff; margin: 10px 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p style="color: #666; text-align: center;">This code will expire in 10 minutes.</p>
          <p style="color: #999; text-align: center; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email OTP:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendEmailOTP,
};
