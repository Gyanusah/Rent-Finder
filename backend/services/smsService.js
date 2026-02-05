// For SMS service, we'll use a mock implementation
// In production, you'd integrate with services like Twilio, AWS SNS, etc.

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mock SMS service - in production, replace with actual SMS provider
const sendSMSOTP = async (phone, otp) => {
  try {
    // For demo purposes, we'll just log the OTP
    console.log('\n' + '📱'.repeat(20) + '📱');
    console.log('📱 SMS OTP CODE GENERATED 📱');
    console.log('📱'.repeat(20) + '📱');
    console.log('📞 Phone:', phone);
    console.log('🔢 OTP CODE:', otp);
    console.log('⏰ TIME:', new Date().toLocaleTimeString());
    console.log('💡 USE THIS CODE TO VERIFY YOUR ACCOUNT');
    console.log('📱'.repeat(20) + '📱\n');

    // In production, you would use something like:
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `Your Rent Finder verification code is: ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone
    // });

    return { success: true };
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendSMSOTP,
};
