const express = require('express');
const router = express.Router();
const {
  sendEmailOTP,
  sendPhoneOTP,
  sendBothOTP,
  verifyOTP,
} = require('../controllers/otpController');

// Public routes
router.post('/send/email', sendEmailOTP);
router.post('/send/phone', sendPhoneOTP);
router.post('/send/both', sendBothOTP);
router.post('/verify', verifyOTP);

module.exports = router;
