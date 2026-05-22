import express from "express";
const router = express.Router();
import {
  sendEmailOTP,
  sendPhoneOTP,
  sendBothOTP,
  verifyOTP,
} from "../controllers/otpController.js";
import { sendEmailOTP as sendEmail } from "../services/emailServices.js";

// Test route to verify email configuration
router.get('/test-email', async (req, res) => {
  try {
    // Log environment status
    console.log('🔍 Test Email - Environment Check:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
    console.log('NODE_ENV:', process.env.NODE_ENV);

    const testEmail = req.query.email || process.env.EMAIL_USER;
    if (!testEmail) {
      return res.status(400).json({
        message: 'Please provide ?email=your@email.com or set EMAIL_USER in env vars'
      });
    }

    const result = await sendEmail(testEmail, '123456');

    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        to: testEmail,
        env: {
          EMAIL_USER: process.env.EMAIL_USER ? '✅ Set' : '❌ Not set',
          EMAIL_PASS: process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set'
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error,
        env: {
          EMAIL_USER: process.env.EMAIL_USER ? '✅ Set' : '❌ Not set',
          EMAIL_PASS: process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set'
        }
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      env: {
        EMAIL_USER: process.env.EMAIL_USER ? '✅ Set' : '❌ Not set',
        EMAIL_PASS: process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set'
      }
    });
  }
});

// Public routes
router.post('/send/email', sendEmailOTP);
router.post('/send/phone', sendPhoneOTP);
router.post('/send/both', sendBothOTP);
router.post('/verify', verifyOTP);

export default router;
