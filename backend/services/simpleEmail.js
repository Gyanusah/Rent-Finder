// Simple email service for development - uses Ethereal email
import nodemailer from "nodemailer";

// Create test account with Ethereal (fake email service for testing)
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('📧 Created test email account:');
    console.log('📧 Email:', testAccount.user);
    console.log('🔑 Password:', testAccount.pass);
    return testAccount;
  } catch (error) {
    console.error('Error creating test account:', error);
    return null;
  }
};

// Send OTP using Ethereal (you can view emails in browser)
const sendTestEmailOTP = async (email, otp) => {
  try {
    // Create test account
    const testAccount = await createTestAccount();

    if (!testAccount) {
      throw new Error('Failed to create test email account');
    }

    // Create transporter with test account
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: `"Rent Finder" <${testAccount.user}>`,
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

    const info = await transporter.sendMail(mailOptions);

    console.log('\n' + '📧'.repeat(30));
    console.log('📧 EMAIL SENT SUCCESSFULLY! 📧');
    console.log('📧'.repeat(30));
    console.log('📧 To:', email);
    console.log('🔢 OTP:', otp);
    console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('💡 Click the URL above to see the email');
    console.log('📧'.repeat(30) + '\n');

    return {
      success: true,
      previewUrl: nodemailer.getTestMessageUrl(info),
      otp: otp // Return OTP for development
    };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
};

export { sendTestEmailOTP };
