import nodemailer from "nodemailer";

// Create transporter using environment variables
const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ Email credentials not configured. Using test mode.');
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Generate OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendEmailOTP = async (email, otp) => {
    try {
        const transporter = createTransporter();

        if (!transporter) {
            throw new Error('Email service not configured');
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Rent Finder - Email Verification OTP',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🏠 Rent Finder</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Email Verification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <p style="font-size: 18px; color: #333; margin: 0 0 20px 0;">Your verification code is:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #667eea; display: inline-block;">
              <h1 style="font-size: 36px; color: #667eea; margin: 0; letter-spacing: 5px; font-weight: bold;">${otp}</h1>
            </div>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 10px 0;">⏰ This code will expire in <strong>10 minutes</strong></p>
            <p style="margin: 10px 0;">🔒 For your security, please don't share this code with anyone</p>
            <p style="margin: 20px 0 0 0;">If you didn't request this, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2024 Rent Finder. All rights reserved.</p>
          </div>
        </div>
      `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', result.messageId);

        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        return { success: false, error: error.message };
    }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
    try {
        const transporter = createTransporter();

        if (!transporter) {
            throw new Error('Email service not configured');
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Rent Finder! 🏠',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🏠 Rent Finder</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Welcome Aboard!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Hi ${name}! 👋</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for joining Rent Finder! We're excited to help you find your perfect rental property.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin: 0 0 15px 0;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Browse our extensive property listings</li>
                <li>Save your favorite properties</li>
                <li>Connect with property owners directly</li>
                <li>Get personalized recommendations</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://rent-finder.vercel.app" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Start Exploring Properties
            </a>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 10px 0;">Need help? Contact us at support@rentfinder.com</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2024 Rent Finder. All rights reserved.</p>
          </div>
        </div>
      `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent:', result.messageId);

        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Welcome email error:', error.message);
        return { success: false, error: error.message };
    }
};

// Send property inquiry notification
export const sendPropertyInquiry = async (ownerEmail, propertyName, tenantName, tenantEmail, message) => {
    try {
        const transporter = createTransporter();

        if (!transporter) {
            throw new Error('Email service not configured');
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: ownerEmail,
            subject: `🏠 New Inquiry for ${propertyName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🏠 Rent Finder</h1>
            <p style="margin: 10px 0; opacity: 0.9;">New Property Inquiry</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 20px 0;">You have a new inquiry! 🎉</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin: 0 0 15px 0;">Property Details</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Property:</strong> ${propertyName}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Tenant:</strong> ${tenantName}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${tenantEmail}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333; margin: 0 0 10px 0;">Message:</h4>
              <p style="color: #666; line-height: 1.6; margin: 0; background: #f8f9fa; padding: 15px; border-radius: 5px;">
                ${message}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">
              Respond quickly to increase your chances of securing the tenant!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2024 Rent Finder. All rights reserved.</p>
          </div>
        </div>
      `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Inquiry email sent:', result.messageId);

        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Inquiry email error:', error.message);
        return { success: false, error: error.message };
    }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const transporter = createTransporter();

        if (!transporter) {
            throw new Error('Email service not configured');
        }

        const resetUrl = `https://rent-finder.vercel.app/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🔐 Rent Finder - Password Reset',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🏠 Rent Finder</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Password Reset</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Reset Your Password 🔐</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                ⚠️ This link will expire in 1 hour for security reasons.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px; margin: 20px 0;">
            <p style="margin: 10px 0;">If you didn't request this, please ignore this email.</p>
            <p style="margin: 10px 0;">Need help? Contact us at support@rentfinder.com</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2024 Rent Finder. All rights reserved.</p>
          </div>
        </div>
      `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent:', result.messageId);

        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Password reset email error:', error.message);
        return { success: false, error: error.message };
    }
};

export default {
    generateOTP,
    sendEmailOTP,
    sendWelcomeEmail,
    sendPropertyInquiry,
    sendPasswordResetEmail,
};