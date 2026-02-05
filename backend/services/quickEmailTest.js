// Quick email test service - for development only
const quickEmailTest = async (email, otp) => {
  console.log('\n' + '='.repeat(60));
  console.log('🔔 EMAIL OTP TEST - DEVELOPMENT MODE');
  console.log('='.repeat(60));
  console.log('📧 Email should be sent to:', email);
  console.log('🔢 OTP Code:', otp);
  console.log('⏰ Valid for: 10 minutes');
  console.log('💡 To enable real emails, configure Gmail App Password');
  console.log('📝 See SETUP_EMAIL.md for instructions');
  console.log('='.repeat(60));
  
  // For development, we'll just show the OTP clearly
  return { 
    success: true, 
    message: `OTP ${otp} would be sent to ${email}`,
    developmentMode: true
  };
};

module.exports = { quickEmailTest };
