# 🚀 Quick Start Guide

## Installation Steps

### Step 1: Clone/Download the Project

Make sure you have the project in `d:\web development\project\rent finder`

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd "d:\web development\project\rent finder\backend"

# Install dependencies
npm install

# Create .env file (already provided with default values)
# Edit .env if you need to change MongoDB URI

# Start backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 3: MongoDB Setup (Local)

If using local MongoDB:

```bash
# Windows
net start MongoDB

# Or if MongoDB is in your PATH
mongod
```

If using MongoDB Atlas (cloud):

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get connection string
3. Update MONGODB_URI in .env file

### Step 4: Seed Sample Data (Optional)

```bash
# In backend directory
npm run seed
```

This will create sample users and properties in the database.

**Sample Credentials:**

- Tenant: `tenant@example.com` / `password123`
- Owner: `owner@example.com` / `password123`

### Step 5: Frontend Setup

Open another terminal/command prompt:

```bash
# Navigate to frontend folder
cd "d:\web development\project\rent finder\frontend"

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Accessing the Application

1. Open browser and go to `http://localhost:3000`
2. You can register a new account or use sample credentials
3. Tenants can search and view properties
4. Owners can add properties through the dashboard

## Common Issues & Solutions

### Port Already in Use

If port 5000 or 3000 is already in use:

Backend:

```bash
# Change port in .env
PORT=5001
```

Frontend:

```bash
# Edit vite.config.js and change port to 3001
```

### MongoDB Connection Error

```
# Make sure MongoDB is running
# Check connection string in .env file
# For local: mongodb://localhost:27017/rentfinder
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/rentfinder
```

### CORS Error

- Backend has CORS enabled for all origins by default
- Should work without additional configuration

### Image Upload Not Working

- Ensure `/backend/uploads` folder exists
- Check file permissions
- Ensure images are JPEG, PNG, or GIF (max 5MB each)

## File Structure Reminder

```
rent finder/
├── backend/                    # Express.js API
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/               # Uploaded images
│   ├── .env
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── frontend/                   # React.js UI
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   ├── index.html
│   ├── .env
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Next Steps

1. Test basic functionality
2. Explore all features as Tenant and Owner
3. Try property search with filters
4. Add properties as Owner
5. Customize colors/branding in tailwind.config.js

## Development Mode Features

- Hot reload for both frontend and backend
- React DevTools browser extension recommended
- MongoDB Compass for database visualization

## Production Deployment

### Backend Deployment (Heroku)

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Add MongoDB Atlas URI
heroku config:set MONGODB_URI=your_connection_string

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Support & Resources

- MongoDB Documentation: https://docs.mongodb.com
- React Documentation: https://react.dev
- Express Documentation: https://expressjs.com
- Tailwind CSS: https://tailwindcss.com

---

**Happy Coding! 🎉**
