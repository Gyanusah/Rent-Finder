import express from "express";
const router = express.Router();
import {
  sendEmailOTP,
  sendPhoneOTP,
  sendBothOTP,
  verifyOTP,
} from "../controllers/otpController.js";

// Public routes
router.post('/send/email', sendEmailOTP);
router.post('/send/phone', sendPhoneOTP);
router.post('/send/both', sendBothOTP);
router.post('/verify', verifyOTP);

export default router;
