// Quick email test service - for development only
export const quickEmailTest = async (email, otp) => {
  console.log('\n' + '='.repeat(60));
  console.log('🔔 EMAIL OTP TEST - DEVELOPMENT MODE');
  console.log('='.repeat(60));
  console.log('📧 Email:', email);
  console.log('🔢 OTP CODE:', otp);
  console.log('⏰ TIME:', new Date().toLocaleTimeString());
  console.log('� USE THIS CODE TO VERIFY YOUR ACCOUNT');
  console.log('📧'.repeat(60) + '\n');

  // For development, we'll just show the OTP clearly
  return {
    success: true,
    message: `OTP ${otp} would be sent to ${email}`,
    developmentMode: true
  };
};
