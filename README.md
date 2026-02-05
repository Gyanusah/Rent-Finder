# RentFinder - House & Room Rent Finder Website

A complete, production-ready, fully responsive House & Room Rent Finder website built with React, Node.js, Express, and MongoDB.

## 🎯 Features

### User Roles

- **Tenant** - Search and view properties, add to wishlist, send inquiries
- **Owner** - Post properties, manage listings, view inquiries
- **Admin** - Manage users and properties (optional)

### Core Features

- ✅ User authentication with JWT
- ✅ Property search and filtering
- ✅ Advanced filters (location, rent range, amenities, furnishing, etc.)
- ✅ Multi-image upload with carousel
- ✅ Wishlist/Favorites system
- ✅ Owner dashboard with CRUD operations
- ✅ Property inquiry system
- ✅ WhatsApp integration
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Google Maps location display
- ✅ Property views tracking
- ✅ Pagination and sorting

### Property Types

- Full house
- Single room
- Shared room
- PG room

### Amenities Supported

- WiFi
- Air Conditioning (AC)
- Parking
- Power Backup
- Water Supply
- Lift
- Gym
- Swimming Pool
- And more...

### House Rules

- Smoking (Allowed/Not Allowed)
- Drinking (Allowed/Not Allowed)
- Pets (Allowed/Not Allowed)
- Guests policy

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Installation & Setup

### Backend Setup

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentfinder
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

For MongoDB Cloud Atlas:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentfinder
```

4. **Start the backend server**

```bash
npm run dev
```

The server will run at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Update API URL (if needed)**
   Edit `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📚 Project Structure

### Backend Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User schema
│   ├── Property.js          # Property schema
│   ├── Favorite.js          # Favorites schema
│   └── Review.js            # Reviews schema
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── propertyController.js # Property logic
│   └── favoriteController.js # Favorites logic
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── propertyRoutes.js    # Property endpoints
│   └── favoriteRoutes.js    # Favorites endpoints
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── upload.js            # Multer configuration
│   └── tokenUtils.js        # Token generation
├── uploads/                  # Uploaded images
├── .env                      # Environment variables
└── server.js                # Express app entry point
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PropertyCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterSidebar.jsx
│   │   ├── ImageCarousel.jsx
│   │   ├── LoadingSkeletons.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   ├── PropertyDetails.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Dashboard.jsx
│   │   └── PropertyForm.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Auth state management
│   ├── services/
│   │   ├── api.js            # Axios instance
│   │   └── apiService.js     # API endpoints
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/update-profile` - Update profile (protected)
- `GET /api/auth/user/:id` - Get user details

### Properties

- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (owner)
- `PUT /api/properties/:id` - Update property (owner)
- `DELETE /api/properties/:id` - Delete property (owner)
- `GET /api/properties/owner/:ownerId` - Get owner's properties
- `POST /api/properties/:id/inquiry` - Send inquiry (tenant)
- `DELETE /api/properties/:id/image` - Delete property image

### Favorites

- `GET /api/favorites` - Get user favorites (protected)
- `POST /api/favorites` - Add to favorites (protected)
- `DELETE /api/favorites/:propertyId` - Remove from favorites (protected)
- `GET /api/favorites/check/:propertyId` - Check if favorited

## 🔐 Authentication Flow

1. User registers with name, email, password, phone, and role
2. Password is hashed using bcryptjs
3. JWT token is generated and returned
4. Token is stored in localStorage
5. Token is sent with every protected request in Authorization header
6. Token is verified on backend before processing request

## 📸 Image Upload

- Maximum 10 images per property
- Supported formats: JPEG, JPG, PNG, GIF
- Maximum file size: 5MB
- Images are stored in `/backend/uploads` directory
- Can be accessed via `/uploads/filename`

## 🎨 Responsive Design

The website is fully responsive with Tailwind CSS:

- **Mobile** (< 640px) - Single column layouts
- **Tablet** (640px - 1024px) - 2 column grids
- **Desktop** (> 1024px) - 3+ column grids
- Mobile-first approach for better performance

## 🧪 Testing

### Sample Test Credentials

**Tenant Account:**

- Email: tenant@example.com
- Password: password123

**Owner Account:**

- Email: owner@example.com
- Password: password123

## 📦 Building for Production

### Backend

```bash
cd backend
npm install --production
# Set environment variables for production
NODE_ENV=production npm start
```

### Frontend

```bash
cd frontend
npm install
npm run build
# dist/ folder contains production-ready files
```

Deploy the `dist` folder to hosting platforms like Vercel, Netlify, or AWS.

## 🔍 Search Filters

- **City/Area/Pincode** - Location-based search
- **Property Type** - Full house, single room, shared room, PG room
- **Rent Range** - Min and max rent
- **Furnishing** - Furnished, semi-furnished, unfurnished
- **Amenities** - WiFi, AC, parking, power backup, etc.
- **Family/Bachelor** - Resident eligibility
- **Pagination** - 12 properties per page

## 🌐 Deployment Recommendations

### Frontend Hosting

- Vercel (recommended for Vite apps)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Backend Hosting

- Heroku (free tier available)
- Railway
- Render
- DigitalOcean
- AWS EC2

### Database Hosting

- MongoDB Atlas (cloud)
- AWS DynamoDB
- Firebase Firestore

## 📝 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentfinder
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check connection string in .env
- For MongoDB Atlas, whitelist your IP

### Image Upload Not Working

- Ensure `/backend/uploads` directory exists
- Check file permissions
- Verify Multer configuration

### CORS Issues

- Backend has CORS enabled for all origins
- For production, update CORS to specific domains

### Authentication Issues

- Clear localStorage and try logging in again
- Check JWT_SECRET is consistent
- Verify token expiration

## 📄 License

This project is open-source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## 📞 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the rental community**
