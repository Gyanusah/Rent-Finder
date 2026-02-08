# OTP Email Debugging Guide

## Quick Diagnostic Steps

### Step 1: Test Email Route (DO THIS FIRST)

After deploying, visit:
```
https://your-backend.vercel.app/api/otp/test-email?email=yourgmail@gmail.com
```

**If email arrives:** ✅ Backend email is working → Check frontend API URL
**If no email:** ❌ Backend/email/env issue → Check Vercel logs

---

### Step 2: Check Vercel Function Logs

**Vercel Dashboard → Deployments → [Latest] → Functions → Logs**

Look for these log messages:

```
📧 Send Email OTP Request: { email: 'user@example.com' }
🔍 Environment Check:
EMAIL_USER: ✅ Set        ← Should show this
EMAIL_PASS: ✅ Set        ← Should show this
NODE_ENV: production
🔢 Generated OTP: 123456
💾 OTP saved to database
📤 Sending email to: user@example.com
📨 Email result: { success: true }
```

**If you see `❌ Not set`:**
→ Add EMAIL_USER and EMAIL_PASS in Vercel Dashboard → Settings → Environment Variables
→ Redeploy

**If you see email errors:**
→ Check the error message in logs
→ Common: `Invalid login`, `EAUTH`, `App password rejected`

---

### Step 3: Check Frontend is Calling Production Backend

**In browser:** Open DevTools → Network → Click "Send OTP"

**Wrong (localhost):**
```
Request URL: http://localhost:5000/api/otp/send/email ❌
```

**Correct (production):**
```
Request URL: https://your-backend.vercel.app/api/otp/send/email ✅
```

**Fix:** Set `VITE_API_BASE_URL=https://your-backend.vercel.app/api` in Vercel frontend env vars

---

## Files Modified for Debugging

| File | Change |
|------|--------|
| `backend/routes/otpRoutes.js` | Added `/test-email` route |
| `backend/controllers/otpController.js` | Added detailed logging for every step |

---

## Common Issues & Solutions

### Issue 1: EMAIL_USER/EMAIL_PASS not set in Production

**Symptom:** Test route shows `EMAIL_USER: ❌ Not set`

**Fix:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - `EMAIL_USER` = your.email@gmail.com
   - `EMAIL_PASS` = your_google_app_password
3. **Make sure Environment is set to "Production"**
4. Redeploy

---

### Issue 2: Gmail App Password Wrong

**Symptom:** Log shows `EAUTH` or `Invalid login`

**Fix:**
1. Go to Google Account → Security → 2-Step Verification → App passwords
2. Generate new app password
3. Use that 16-character password (not your Gmail password)
4. Update EMAIL_PASS in Vercel
5. Redeploy

---

### Issue 3: OTP Stored in Memory (Not Your Case)

Your OTP is correctly stored in MongoDB via `OTPModel` - this is already correct.

---

## Deployment Checklist

- [ ] Backend deployed to Vercel with env vars
- [ ] Frontend `VITE_API_BASE_URL` points to backend
- [ ] Test email route works
- [ ] OTP email arrives on live site

---

## Quick Commands

```bash
# Test email from command line
curl "https://your-backend.vercel.app/api/otp/test-email?email=test@gmail.com"

# Check if backend is up
curl https://your-backend.vercel.app/
```
