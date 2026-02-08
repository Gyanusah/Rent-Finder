# Vercel Deployment Checklist - Auth Fix

## Quick Fix Summary

### 1. Environment Variables (MOST CRITICAL)

In **Vercel Dashboard → Project → Settings → Environment Variables**, add:

| Variable | Value | Where to Get It |
|----------|-------|-----------------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | MongoDB Atlas → Database → Connect → Drivers → Node.js |
| `JWT_SECRET` | Random string (min 32 chars) | Generate at https://jwtsecret.com |
| `JWT_EXPIRE` | `7d` | Same as local |
| `EMAIL_USER` | Your Gmail address | Gmail account |
| `EMAIL_PASS` | Gmail App Password | Google Account → Security → 2FA → App passwords |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Your API key | Cloudinary Dashboard → Settings |
| `CLOUDINARY_API_SECRET` | Your API secret | Cloudinary Dashboard → Settings |

⚠️ **Important**: 
- Add to **Production** environment
- Also add to **Preview** if you want preview deployments to work
- Redeploy after adding variables!

---

### 2. Frontend Environment Variable

Create `frontend/.env.production`:

```
VITE_API_BASE_URL=https://your-backend-url.vercel.app/api
```

⚠️ **Common mistake**: Don't use the frontend URL here - use your separate backend deployment URL!

---

### 3. Two-Deployment Strategy

**Option A: Separate Deployments (Recommended)**

**Backend Deployment:**
1. Go to https://vercel.com/new
2. Import your repo
3. Set root directory to `backend/`
4. Add all environment variables from checklist above
5. Deploy → get URL like `https://rent-finder-api.vercel.app`

**Frontend Deployment:**
1. Deploy frontend separately
2. Set `VITE_API_BASE_URL` to your backend URL
3. Deploy

---

### 4. Debugging Silent Auth Failures

Check server logs in Vercel Dashboard → Deployments → [Latest] → Functions → server.js

**New error messages you should see:**
- `❌ Missing required environment variables: MONGODB_URI` - Add the missing env var
- `Register Error: ...` - Check the stack trace in logs
- `CORS blocked origin: ...` - Update CORS config

---

### 5. Files Modified

1. `frontend/src/services/apiService.js` - Fixed default URL
2. `backend/server.js` - Added env validation + better CORS
3. `backend/controllers/authController.js` - Added error logging

---

### 6. Quick Test After Deploy

1. Open browser dev tools → Network tab
2. Try to register/login
3. Check:
   - Request URL matches your backend
   - Response shows actual error (not CORS error)
   - Server logs show the error details

---

## Still Not Working?

1. **Check MongoDB IP whitelist** - Add `0.0.0.0/0` to allow all IPs (Vercel has dynamic IPs)
2. **Verify JWT_SECRET is set** - Auth will fail silently without this
3. **Test backend directly** - Visit `https://your-api.vercel.app/api/auth/register` with POST
4. **Check CORS** - Look for CORS errors in browser console
