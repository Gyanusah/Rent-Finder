# 🌐 Deployment Guide - RentFinder

Complete guide to deploy RentFinder to production.

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel / Netlify                          │
│                     (React Frontend - dist)                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                   CORS enabled
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
   ┌────▼────────────┐              ┌────────▼──────┐
   │  Heroku / Railway             │ MongoDB Atlas  │
   │  (Node.js Backend)            │  (Database)    │
   │  Express Server               │                │
   └────────────────┘              └────────────────┘
```

---

## Frontend Deployment (React)

### Option 1: Vercel (Recommended)

**Prerequisites:**

- Vercel account (free)
- Git repository with frontend code
- Vercel CLI

**Steps:**

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy from frontend directory**

```bash
cd frontend
vercel
```

4. **Follow prompts:**

   - Project name: `rentfinder-frontend`
   - Framework: React
   - Root directory: ./
   - Build command: `npm run build`
   - Output directory: `dist`

5. **Environment Variables in Vercel Dashboard:**

   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.com/api`

6. **Automatic Deployments:**
   - Connect Git repository for auto-deploy on push

### Option 2: Netlify

1. **Build the project**

```bash
cd frontend
npm run build
```

2. **Drag and drop `dist` folder to Netlify**

   - Visit netlify.com
   - Drag dist folder to drop zone

3. **Configure build**

   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add environment variables**
   - Settings → Build & Deploy → Environment
   - Add `VITE_API_URL` pointing to backend URL

### Option 3: AWS S3 + CloudFront

1. **Build project**

```bash
npm run build
```

2. **Create S3 bucket**

   - Enable static website hosting
   - Upload contents of `dist` folder

3. **Create CloudFront distribution**

   - Point to S3 bucket
   - Add custom domain (optional)

4. **Set environment in build**

```bash
VITE_API_URL=https://api.yourdomain.com npm run build
```

---

## Backend Deployment (Node.js)

### Option 1: Heroku

**Prerequisites:**

- Heroku account (paid dyno required)
- Heroku CLI
- Git repository

**Steps:**

1. **Install Heroku CLI**

```bash
# Windows
choco install heroku-cli

# Or download from heroku.com/cli
```

2. **Login to Heroku**

```bash
heroku login
```

3. **Create Heroku app**

```bash
cd backend
heroku create rentfinder-api
```

4. **Set environment variables**

```bash
heroku config:set PORT=5000
heroku config:set MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rentfinder
heroku config:set JWT_SECRET=your_super_secret_key
heroku config:set NODE_ENV=production
```

5. **Deploy**

```bash
git push heroku main
```

6. **View logs**

```bash
heroku logs --tail
```

### Option 2: Railway (Easiest Free Option)

**Prerequisites:**

- Railway account (github.com/railwayapp)
- GitHub repository

**Steps:**

1. **Create Railway account**

   - Sign up at railway.app with GitHub

2. **Create new project**

   - Click "New Project"
   - Select "GitHub Repo"
   - Select your repository

3. **Add services**

   - Add Node.js service (select backend folder)
   - Add MongoDB service (or use MongoDB Atlas)

4. **Configure environment variables**

   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV=production

5. **Deploy**
   - Railway auto-deploys on git push

### Option 3: DigitalOcean App Platform

1. **Create DigitalOcean account**

2. **Create App**

   - New → App Platform
   - Connect GitHub repository
   - Select `backend` directory

3. **Configure environment**

   - Set environment variables
   - Resource: Basic ($5-12/month)

4. **Deploy**
   - Click deploy

---

## Database Deployment

### MongoDB Atlas (Cloud - Recommended)

**Free tier available (512MB)**

1. **Create account**

   - Visit mongodb.com/cloud/atlas
   - Sign up with email or GitHub

2. **Create cluster**

   - Choose free tier (M0)
   - Select region (closest to users)
   - Wait for cluster creation (5-10 min)

3. **Get connection string**

   - Cluster → Connect → Connect Application
   - Copy connection string
   - Replace `<username>`, `<password>`, and `<dbname>`

4. **Example connection string**

```
mongodb+srv://rentfinder_user:secure_password@cluster0.mongodb.net/rentfinder?retryWrites=true&w=majority
```

5. **Add to backend .env**

```env
MONGODB_URI=mongodb+srv://rentfinder_user:secure_password@cluster0.mongodb.net/rentfinder
```

6. **Seed data** (optional)

```bash
npm run seed
```

### Network Access

- Atlas → Security → Network Access
- Add current IP (or 0.0.0.0/0 for any IP - not recommended for prod)

---

## API Deployment Checklist

- [ ] Remove console.logs or use logging library
- [ ] Add input validation on all endpoints
- [ ] Implement rate limiting
- [ ] Add CORS whitelisting (specific origins)
- [ ] Use HTTPS everywhere
- [ ] Implement request size limits
- [ ] Add error logging
- [ ] Set secure headers (helmet.js)
- [ ] Use environment variables for all secrets
- [ ] Implement database connection pooling
- [ ] Add API documentation
- [ ] Setup monitoring/alerts
- [ ] Regular database backups

### Recommended Security Packages

```bash
npm install helmet express-rate-limit cors dotenv-cli morgan
```

Update `server.js`:

```javascript
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

app.use(helmet()); // Security headers
app.use(morgan("combined")); // Request logging
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
  })
);
```

---

## Frontend Deployment Checklist

- [ ] Run production build locally
- [ ] Test all routes with production API URL
- [ ] Check responsive design on all devices
- [ ] Test image loading
- [ ] Verify authentication flow
- [ ] Check console for errors/warnings
- [ ] Add meta tags for SEO
- [ ] Test with slow network (DevTools)
- [ ] Setup analytics (Google Analytics)
- [ ] Setup error tracking (Sentry)
- [ ] Minify images
- [ ] Set correct API base URL for production

---

## Custom Domain Setup

### For Frontend (Vercel)

1. **Buy domain** (Namecheap, GoDaddy, etc.)

2. **In Vercel:**

   - Project Settings → Domains
   - Add custom domain
   - Copy nameservers

3. **In domain provider:**
   - Update nameservers to Vercel's
   - Or use CNAME record

### For Backend (Heroku)

1. **In Heroku:**

   - App Settings → Domains
   - Add custom domain
   - Use CNAME record pointing to Heroku

2. **In domain provider:**
   - Create CNAME record
   - `api.yourdomain.com` → `your-app.herokuapp.com`

---

## CI/CD Pipeline Setup (GitHub Actions)

### Deploy Frontend on Push

Create `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - "frontend/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install
        working-directory: frontend

      - name: Build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
        run: npm run build
        working-directory: frontend

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Monitoring & Alerts

### Application Monitoring

- **Sentry** - Error tracking
- **LogRocket** - Session replay and logging
- **New Relic** - Performance monitoring

### Database Monitoring

- MongoDB Atlas dashboard
- Set up alerts for disk usage, connections

### Uptime Monitoring

- UptimeRobot - Free uptime monitoring
- Pingdom - Website monitoring

---

## Troubleshooting Deployments

### Frontend Not Loading

- Check VITE_API_URL environment variable
- Clear browser cache (Ctrl+Shift+Del)
- Check browser console for errors
- Verify backend is running and accessible

### API Calls Failing

- Check CORS configuration
- Verify JWT token is being sent
- Check backend logs
- Test API endpoint with Postman/curl

### Database Connection Failed

- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Test connection locally first
- Check credentials are correct

### Deployment Failed

- Check build logs
- Verify all dependencies are listed
- Check for hardcoded paths
- Ensure environment variables are set

---

## Performance Optimization

### Frontend

```bash
# Analyze bundle size
npm install -g vite-plugin-visualizer

# Lazy load routes
React.lazy(() => import('./pages/PropertyDetails'))
```

### Backend

```javascript
// Add caching
app.use(
  express.static("uploads", {
    maxAge: "1d",
    etag: false,
  })
);

// Database indexes on frequently searched fields
Property.collection.createIndex({ city: 1 });
Property.collection.createIndex({ rent: 1 });
```

---

## Cost Estimates (Monthly)

- **Frontend (Vercel):** Free
- **Backend (Railway):** Free-$5
- **Database (MongoDB Atlas):** Free (512MB)
- **Domain:** $0.99-$12
- **Total:** $1-17/month

---

## Rollback Procedure

If deployment goes wrong:

### Vercel

```bash
vercel rollback
```

### Heroku

```bash
heroku releases
heroku rollback v10
```

### Railway

Click rollback button in dashboard

---

## Backup Strategy

1. **Database backups**

   - MongoDB Atlas → Backup → Enable automated backups
   - Daily backups retained for 7 days

2. **Code backups**

   - Use Git for version control
   - Tag releases: `git tag v1.0.0`

3. **File backups**
   - Upload images directory to S3/backup service

---

**Last Updated: January 2024**

For detailed platform-specific guides, refer to official documentation:

- Vercel: https://vercel.com/docs
- Railway: https://railway.app/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Heroku: https://devcenter.heroku.com
