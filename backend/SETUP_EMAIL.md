# Email OTP Setup Guide

To make OTP work with actual email sending, you need to configure Gmail credentials:

## Step 1: Enable 2-Step Verification on your Gmail account
1. Go to your Google Account settings
2. Security → 2-Step Verification → Turn on

## Step 2: Generate App Password
1. Go to Google Account settings
2. Security → App passwords
3. Select "Mail" for app and "Other (Custom name)" for device
4. Name it "Rent Finder OTP"
5. Copy the 16-character password

## Step 3: Update your .env file
Add these lines to your backend/.env file:

```bash
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

## Step 4: Restart the backend server
Stop and restart the backend server to pick up the new environment variables.

## Testing
After setup, OTPs will be sent to actual email addresses instead of just being logged in the console.

## Note
- Use a Gmail account for testing
- The app password is different from your regular password
- Never commit your .env file to version control
