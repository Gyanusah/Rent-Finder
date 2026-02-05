# 🎨 RentFinder - Visual & Features Overview

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER (Frontend)                      │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  React App (Vite)                                            │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │ App.jsx (Router)                                       │  │   │
│  │  │ ├─ Navbar (Navigation)                                 │  │   │
│  │  │ ├─ Page Components                                     │  │   │
│  │  │ │  ├─ Home (featured properties)                       │  │   │
│  │  │ │  ├─ Search (with filters)                            │  │   │
│  │  │ │  ├─ PropertyDetails (carousel + inquiry)             │  │   │
│  │  │ │  ├─ Login/Register (auth)                            │  │   │
│  │  │ │  ├─ Wishlist (saved properties)                      │  │   │
│  │  │ │  ├─ Dashboard (owner management)                     │  │   │
│  │  │ │  └─ PropertyForm (add/edit)                          │  │   │
│  │  │ ├─ Footer (info + links)                               │  │   │
│  │  │ └─ Context: AuthContext (state management)             │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  │  Services: api.js (Axios) + apiService.js (endpoints)        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│                    ↓ HTTP/HTTPS (REST API) ↓                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ CORS enabled
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                    WEB SERVER (Backend)                              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Express.js Server                                            │   │
│  │ ┌────────────────────────────────────────────────────────┐   │   │
│  │ │ Routes & Controllers                                  │   │   │
│  │ │ ├─ /api/auth/* (authController)                       │   │   │
│  │ │ │  ├─ register                                        │   │   │
│  │ │ │  ├─ login                                           │   │   │
│  │ │ │  ├─ getMe                                           │   │   │
│  │ │ │  └─ updateProfile                                  │   │   │
│  │ │ │                                                      │   │   │
│  │ │ ├─ /api/properties/* (propertyController)             │   │   │
│  │ │ │  ├─ getAll (search + filter)                        │   │   │
│  │ │ │  ├─ getById                                         │   │   │
│  │ │ │  ├─ create                                          │   │   │
│  │ │ │  ├─ update                                          │   │   │
│  │ │ │  ├─ delete                                          │   │   │
│  │ │ │  ├─ sendInquiry                                     │   │   │
│  │ │ │  └─ deleteImage                                     │   │   │
│  │ │ │                                                      │   │   │
│  │ │ └─ /api/favorites/* (favoriteController)              │   │   │
│  │ │    ├─ getAll                                          │   │   │
│  │ │    ├─ add                                             │   │   │
│  │ │    ├─ remove                                          │   │   │
│  │ │    └─ check                                           │   │   │
│  │ │                                                        │   │   │
│  │ └── Middleware                                           │   │   │
│  │    ├─ auth (JWT verification)                            │   │   │
│  │    └─ upload (Multer for images)                         │   │   │
│  │                                                           │   │   │
│  │ Models: User, Property, Favorite, Review                 │   │   │
│  └────────────────────────────────────────────────────────┘   │   │
│                                                                 │   │
│                     ↓ Database Driver ↓                        │   │
│  ┌────────────────────────────────────────────────────────┐   │   │
│  │ Mongoose ODM                                          │   │   │
│  └────────────────────────────────────────────────────────┘   │   │
│                                                                 │   │
│  /uploads/ (Image storage)                                    │   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ↓ TCP/IP
┌─────────────────────────────────────────────────────────────────────┐
│                      MongoDB Database                               │
│                                                                       │
│  Collections:                                                        │
│  ├─ Users (authentication, profile)                                 │
│  ├─ Properties (listings, details, images)                          │
│  ├─ Favorites (wishlist)                                            │
│  └─ Reviews (ratings)                                               │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 User Journey Maps

### 👨 Tenant User Journey

```
START
  │
  ├─→ LANDING PAGE (Home)
  │   └─→ See featured properties
  │   └─→ Search bar visible
  │
  ├─→ REGISTER/LOGIN
  │   └─→ Create account or sign in
  │   └─→ JWT token stored
  │
  ├─→ SEARCH PAGE
  │   └─→ Search by location
  │   └─→ Apply multiple filters
  │   └─→ Sort results
  │   └─→ Pagination
  │
  ├─→ PROPERTY DETAILS
  │   └─→ View carousel images
  │   └─→ See all details
  │   └─→ Check amenities & rules
  │   └─→ View owner contact
  │
  ├─→ WISHLIST (❤️)
  │   └─→ Add to favorites
  │   └─→ View saved properties
  │   └─→ Remove from favorites
  │
  ├─→ INQUIRY
  │   └─→ Send message to owner
  │   └─→ Contact via WhatsApp
  │
  └─→ PROFILE
      └─→ View/edit account info
      └─→ See saved preferences

END
```

### 🏢 Owner User Journey

```
START
  │
  ├─→ REGISTER/LOGIN as OWNER
  │   └─→ Create owner account
  │   └─→ JWT token stored
  │
  ├─→ DASHBOARD
  │   └─→ View statistics
  │   │   ├─ Total properties
  │   │   ├─ Total views
  │   │   └─ Total inquiries
  │   │
  │   └─→ Properties list
  │       ├─ All owned properties
  │       ├─ Status (Available/Rented)
  │       └─ Quick actions
  │
  ├─→ ADD PROPERTY
  │   └─→ Fill all details
  │   │   ├─ Title, description
  │   │   ├─ Location & pricing
  │   │   ├─ Features & amenities
  │   │   └─ House rules
  │   │
  │   └─→ Upload images (up to 10)
  │   │   └─ Image carousel ready
  │   │
  │   └─→ Publish property
  │       └─→ Visible to tenants
  │
  ├─→ MANAGE PROPERTY
  │   ├─→ EDIT
  │   │   └─ Update any details
  │   │   └─ Add more images
  │   │   └─ Change availability
  │   │
  │   ├─→ VIEW INQUIRIES
  │   │   └─ See tenant messages
  │   │   └─ Contact details
  │   │
  │   ├─→ TRACK VIEWS
  │   │   └─ Property view count
  │   │
  │   └─→ DELETE
  │       └─ Remove property
  │
  ├─→ PROFILE
  │   └─→ Edit account info
  │   └─→ Add bio & address
  │   └─→ Profile picture
  │
  └─→ LOGOUT

END
```

---

## 📊 Feature Matrix

### Authentication Features

| Feature        | Tenant | Owner | Admin | Status             |
| -------------- | ------ | ----- | ----- | ------------------ |
| Register       | ✅     | ✅    | ✅    | Complete           |
| Login          | ✅     | ✅    | ✅    | Complete           |
| Logout         | ✅     | ✅    | ✅    | Complete           |
| Profile View   | ✅     | ✅    | ✅    | Complete           |
| Profile Edit   | ✅     | ✅    | ✅    | Complete           |
| Password Reset | ⏳     | ⏳    | ⏳    | Ready to implement |

### Property Features

| Feature      | Tenant | Owner | Status   |
| ------------ | ------ | ----- | -------- |
| View All     | ✅     | ✅    | Complete |
| Search       | ✅     | -     | Complete |
| Filter       | ✅     | -     | Complete |
| View Details | ✅     | ✅    | Complete |
| Add/Create   | -      | ✅    | Complete |
| Edit         | -      | ✅    | Complete |
| Delete       | -      | ✅    | Complete |
| View Count   | -      | ✅    | Complete |

### Image Features

| Feature           | Support       | Status             |
| ----------------- | ------------- | ------------------ |
| Single Upload     | ✅            | Complete           |
| Multiple Upload   | ✅ (up to 10) | Complete           |
| Carousel          | ✅            | Complete           |
| Thumbnail Gallery | ✅            | Complete           |
| Delete Image      | ✅            | Complete           |
| Lazy Loading      | ⏳            | Ready to implement |

### Search & Filter Features

| Feature              | Status | Details            |
| -------------------- | ------ | ------------------ |
| Search by City       | ✅     | Case-insensitive   |
| Search by Area       | ✅     | Case-insensitive   |
| Search by Pincode    | ✅     | 6-digit validation |
| Filter by Type       | ✅     | 4 property types   |
| Filter by Rent       | ✅     | Min & max range    |
| Filter by Furnishing | ✅     | 3 options          |
| Filter by Amenities  | ✅     | 10+ amenities      |
| Sort Results         | ✅     | Multiple options   |
| Pagination           | ✅     | 12 per page        |

### Responsive Design

| Device    | Status | Details                |
| --------- | ------ | ---------------------- |
| Mobile    | ✅     | < 640px, single column |
| Tablet    | ✅     | 640-1024px, 2 columns  |
| Desktop   | ✅     | > 1024px, 3+ columns   |
| Landscape | ✅     | Optimized layout       |
| Touch     | ✅     | 48px min buttons       |

---

## 🎨 UI/UX Components

### Reusable Components

```
Navbar
├─ Logo & Brand
├─ Navigation Links
├─ Search Input (mobile)
├─ User Dropdown
└─ Mobile Hamburger Menu

PropertyCard
├─ Image with Badge
├─ Heart Button (Wishlist)
├─ Title (2 lines max)
├─ Location
├─ Rent & Deposit
├─ Key Details Grid
├─ Amenity Icons
├─ Owner Info
└─ View Details Button

SearchBar
├─ City Input
├─ Area Input
├─ Type Dropdown
├─ Min Rent Input
├─ Max Rent Input
└─ Search Button

FilterSidebar
├─ Furnishing Filters
├─ Amenities Checkboxes
├─ Resident Type
├─ Reset Button
└─ Sticky Positioning

ImageCarousel
├─ Main Image
├─ Previous/Next Buttons
├─ Image Counter
└─ Thumbnail Gallery

Footer
├─ Company Info
├─ Quick Links
├─ Support Links
├─ Social Links
└─ Copyright
```

---

## 🔄 Data Flow Diagrams

### Authentication Flow

```
User Input (Email, Password)
        ↓
Register.jsx / Login.jsx
        ↓
AuthContext.jsx (register/login function)
        ↓
apiService.authAPI.register/login()
        ↓
api.js (Axios POST)
        ↓
Backend: POST /api/auth/register or /api/auth/login
        ↓
authController (register/login logic)
        ↓
User.js Model (findOne/create)
        ↓
bcryptjs (hash/compare password)
        ↓
tokenUtils.js (generateToken)
        ↓
Response with token
        ↓
Frontend: localStorage.setItem('token')
        ↓
AuthContext update state
        ↓
Navigation to Home
```

### Property Search Flow

```
User enters filters
        ↓
SearchBar.jsx (handleSearch)
        ↓
Navigate to /search with query params
        ↓
Search.jsx (useSearchParams)
        ↓
propertyAPI.getAll(params)
        ↓
api.js (Axios GET with filters)
        ↓
Backend: GET /api/properties?filters
        ↓
propertyController.getProperties()
        ↓
Property.js Model.find({filters})
        ↓
MongoDB query
        ↓
Results returned
        ↓
Populate owner details
        ↓
Response with count, pages, data
        ↓
Frontend: Display PropertyCard components
        ↓
Pagination controls visible
```

### Add Property Flow

```
Owner fills PropertyForm.jsx
        ↓
Selects images
        ↓
Creates FormData object
        ↓
propertyAPI.create(formData)
        ↓
api.js (POST with multipart/form-data)
        ↓
Backend: POST /api/properties (auth required)
        ↓
Middleware: auth.js (JWT verification)
        ↓
Middleware: upload.js (Multer processing)
        ↓
propertyController.createProperty()
        ↓
Process JSON fields
        ↓
Property.js Model.save()
        ↓
MongoDB creates document
        ↓
Images stored in /uploads
        ↓
Response with property data
        ↓
Frontend: Redirect to Dashboard
        ↓
New property visible in list
```

---

## 📱 Screen Layouts

### Mobile Layout (< 640px)

```
┌─────────────────────┐
│  [☰] RentFinder  [👤] │ ← Navbar
├─────────────────────┤
│  Search Bar         │
│  [City] [Rent]      │
│  [Search Button]    │
├─────────────────────┤
│  Property Card 1    │
│  [Image]            │
│  [❤️ Icon]           │
│  Title (2 lines)    │
│  📍 Location        │
│  ₹ Rent             │
│  [View Details]     │
├─────────────────────┤
│  Property Card 2    │
│  ... (same layout)  │
├─────────────────────┤
│  [← Prev] 1 [Next →]│
├─────────────────────┤
│  Footer             │
└─────────────────────┘
```

### Tablet Layout (640px - 1024px)

```
┌──────────────────────────────────┐
│ Logo  Navbar Links  [👤 User]    │
├──────────────────────────────────┤
│ City   Area   Type  Min  Max [🔍] │
├──────────────────────────────────┤
│ Property Card 1  │  Property Card 2│
│ [Image]          │  [Image]        │
│ [❤️] Title        │  [❤️] Title     │
│ ₹ Rent           │  ₹ Rent        │
│ [View Details]   │  [View Details]│
├──────────────────────────────────┤
│ Property Card 3  │  Property Card 4│
│ ... (same)       │  ... (same)    │
├──────────────────────────────────┤
│  [← Prev] 1  2  3 [Next →]       │
├──────────────────────────────────┤
│ Footer Info | Links | Social     │
└──────────────────────────────────┘
```

### Desktop Layout (> 1024px)

```
┌──────────────────────────────────────────────────────────┐
│ Logo RentFinder  [Home] [Search] [Dashboard] [👤 User]  │
├──────────────────────────────────────────────────────────┤
│ City  Area  Type  MinRent  MaxRent  [Search Button]    │
├──────────────────────────────────────────────────────────┤
│ Filters │ Property Card 1  Property Card 2  Property Card 3
│ ┌─────┐ ├──────────────┐ ├──────────────┐ ├──────────────┐
│ │Furn │ │ [Image]      │ │ [Image]      │ │ [Image]      │
│ │□ Furn│ │ [❤️] Title    │ │ [❤️] Title    │ │ [❤️] Title    │
│ │□ Semi│ │ 📍 Location  │ │ 📍 Location  │ │ 📍 Location  │
│ │□ Unf │ │ ₹ Rent      │ │ ₹ Rent      │ │ ₹ Rent      │
│ │      │ │ [View >]     │ │ [View >]     │ │ [View >]     │
│ │Amen  │ └──────────────┘ └──────────────┘ └──────────────┘
│ │☑WiFi │
│ │☑AC   │ Property Card 4  Property Card 5  Property Card 6
│ │☑Park │ ... (same layout)
│ │      │
│ │[Reset]
└──────────────────────────────────────────────────────────┘
│ [← Prev] 1  2  3  4  [Next →]                           │
├──────────────────────────────────────────────────────────┤
│ Footer: About | Contact | Privacy | Terms | Social      │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Key UI Elements

### Color Scheme

- **Primary:** `#2563eb` (Blue) - Main action buttons
- **Secondary:** `#f59e0b` (Amber) - Alerts
- **Accent:** `#ec4899` (Pink) - Favorites
- **Success:** `#10b981` (Green) - Positive actions
- **Danger:** `#ef4444` (Red) - Delete, warnings
- **Background:** `#f9fafb` (Light Gray) - Pages

### Typography

- **Headings:** Bold, 24px-48px
- **Subheadings:** Semi-bold, 18px-24px
- **Body:** Regular, 14px-16px
- **Labels:** Medium, 12px-14px

### Spacing

- **Grid Gap:** 24px (desktop), 16px (tablet), 8px (mobile)
- **Padding:** 16px-32px containers
- **Margins:** 8px-24px elements

### Buttons

- **Primary:** Blue background, white text, 48px height (mobile)
- **Secondary:** Gray background, dark text
- **Text:** No background, blue text, underline on hover

---

## ✨ Animations & Transitions

- **Hover Effects:** Scale, shadow, color change
- **Loading:** Pulse skeletons
- **Carousel:** Smooth image transitions
- **Modals:** Fade in/out
- **Dropdowns:** Slide down
- **Forms:** Input focus highlight
- **Buttons:** Click feedback

---

**This visual architecture provides a comprehensive understanding of the RentFinder application's structure and user experience.**

**Last Updated: January 2024**
