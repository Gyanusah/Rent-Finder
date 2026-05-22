// Mock SMS service for development
// Replace with actual Twilio integration when ready

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS (Mock implementation)
export const sendSMSOTP = async (phone, otp) => {
  try {
    console.log(`📱 Mock SMS to ${phone}: Your verification code is ${otp}`);

    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✅ Mock SMS sent successfully');
    return { success: true, messageId: 'mock-sms-id-' + Date.now() };
  } catch (error) {
    console.error('❌ SMS send error:', error.message);
    return { success: false, error: error.message };
  }
};

export default {
  generateOTP,
  sendSMSOTP,
};
