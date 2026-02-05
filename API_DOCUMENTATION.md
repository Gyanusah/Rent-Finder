# RentFinder API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register User

**POST** `/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "tenant" // or "owner"
}
```

**Response:** (201)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "63f8e9b3d3c4f5g6h7i8j9k0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant",
    "phone": "9876543210"
  }
}
```

---

### Login User

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** (200)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "63f8e9b3d3c4f5g6h7i8j9k0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant",
    "phone": "9876543210"
  }
}
```

---

### Get Current User (Protected)

**GET** `/auth/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** (200)

```json
{
  "success": true,
  "data": {
    "_id": "63f8e9b3d3c4f5g6h7i8j9k0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant",
    "phone": "9876543210",
    "avatar": null,
    "bio": null,
    "address": null,
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

---

### Update User Profile (Protected)

**PUT** `/auth/update-profile`

**Request Body:**

```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "bio": "I'm looking for a house",
  "address": "123 Main St, City",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:** (200)

```json
{
  "success": true,
  "data": {
    "_id": "63f8e9b3d3c4f5g6h7i8j9k0",
    "name": "John Updated",
    "bio": "I'm looking for a house",
    "address": "123 Main St, City",
    ...
  }
}
```

---

### Get User by ID

**GET** `/auth/user/:id`

**Response:** (200)

```json
{
  "success": true,
  "data": {
    "_id": "63f8e9b3d3c4f5g6h7i8j9k0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant",
    "phone": "9876543210"
  }
}
```

---

## 🏠 Property Endpoints

### Get All Properties (with filters)

**GET** `/properties`

**Query Parameters:**

- `city` - Search by city (string)
- `area` - Search by area (string)
- `propertyType` - Filter by type (full_house, single_room, shared_room, pg_room)
- `furnishing` - Filter by furnishing (furnished, semi-furnished, unfurnished)
- `minRent` - Minimum rent (number)
- `maxRent` - Maximum rent (number)
- `familyAllowed` - true/false
- `bachelorAllowed` - true/false
- `amenities` - Comma-separated amenities (wifi, ac, parking, etc.)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 12)
- `sort` - Sort by field (default: -createdAt)

**Example:**

```
GET /properties?city=Mumbai&area=Bandra&minRent=30000&maxRent=100000&page=1&limit=12
```

**Response:** (200)

```json
{
  "success": true,
  "count": 12,
  "total": 45,
  "pages": 4,
  "currentPage": 1,
  "data": [
    {
      "_id": "63f8e9b3d3c4f5g6h7i8j9k0",
      "title": "2BHK Apartment in Bandra",
      "description": "Beautiful apartment...",
      "address": "123 Marine Drive",
      "city": "Mumbai",
      "area": "Bandra",
      "pincode": "400050",
      "rent": 65000,
      "deposit": 195000,
      "maintenance": 3000,
      "propertyType": "full_house",
      "roomType": "2BHK",
      "roomCount": 2,
      "bathrooms": {
        "total": 2,
        "attached": 2,
        "common": 0
      },
      "furnishing": "semi-furnished",
      "floor": {
        "current": 3,
        "total": 5
      },
      "roomSize": {
        "value": 850,
        "unit": "sqft"
      },
      "balcony": true,
      "amenities": {
        "wifi": true,
        "ac": true,
        "parking": true,
        "powerBackup": true,
        "waterSupply": true,
        "lift": true
      },
      "rules": {
        "smoking": false,
        "drinking": false,
        "pets": false
      },
      "familyAllowed": true,
      "bachelorAllowed": false,
      "images": [
        {
          "url": "/uploads/image-1234567890.jpg",
          "uploadedAt": "2024-01-20T10:30:00Z"
        }
      ],
      "owner": {
        "_id": "63f8e9b3d3c4f5g6h7i8j9k0",
        "name": "Priya Owner",
        "email": "owner@example.com",
        "phone": "9987654321"
      },
      "views": 150,
      "availability": {
        "available": true,
        "availableFrom": "2024-01-25T00:00:00Z",
        "rented": false
      },
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

---

### Get Property Details

**GET** `/properties/:id`

**Response:** (200)

```json
{
  "success": true,
  "data": {
    // Same as above property object
  }
}
```

---

### Create Property (Protected - Owner Only)

**POST** `/properties`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**

```
title: "2BHK Apartment"
description: "Beautiful apartment..."
address: "123 Marine Drive"
city: "Mumbai"
area: "Bandra"
pincode: "400050"
rent: 65000
deposit: 195000
maintenance: 3000
propertyType: "full_house"
roomType: "2BHK"
roomCount: 2
furnishing: "semi-furnished"
balcony: true
familyAllowed: true
bachelorAllowed: false

bathrooms: {"total": 2, "attached": 2, "common": 0}
floor: {"current": 3, "total": 5}
roomSize: {"value": 850, "unit": "sqft"}
amenities: {"wifi": true, "ac": true, "parking": true, ...}
rules: {"smoking": false, "drinking": false, "pets": false}

images: [File, File, ...]  // Up to 10 images
```

**Response:** (201)

```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    // Full property object with _id
  }
}
```

---

### Update Property (Protected - Owner Only)

**PUT** `/properties/:id`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:** Same as create property (can include additional images)

**Response:** (200)

```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": {
    // Updated property object
  }
}
```

---

### Delete Property (Protected - Owner Only)

**DELETE** `/properties/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** (200)

```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

### Get Properties by Owner

**GET** `/properties/owner/:ownerId`

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

**Response:** (200)

```json
{
  "success": true,
  "count": 5,
  "total": 12,
  "pages": 2,
  "currentPage": 1,
  "data": [
    // Array of properties
  ]
}
```

---

### Send Inquiry (Protected)

**POST** `/properties/:id/inquiry`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "message": "I'm interested in this property. Can you provide more details?"
}
```

**Response:** (200)

```json
{
  "success": true,
  "message": "Inquiry sent successfully",
  "data": {
    // Updated property object with new inquiry
  }
}
```

---

### Delete Property Image (Protected - Owner Only)

**DELETE** `/properties/:id/image`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "imageUrl": "/uploads/image-1234567890.jpg"
}
```

**Response:** (200)

```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    // Updated property object without the deleted image
  }
}
```

---

## ❤️ Favorites Endpoints

### Get User Favorites (Protected)

**GET** `/favorites`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

**Response:** (200)

```json
{
  "success": true,
  "count": 5,
  "total": 12,
  "pages": 2,
  "currentPage": 1,
  "data": [
    {
      "_id": "63f8e9b3d3c4f5g6h7i8j9k0",
      "user": "63f8e9b3d3c4f5g6h7i8j9k1",
      "property": {
        // Full property object
      },
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

---

### Add to Favorites (Protected)

**POST** `/favorites`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "propertyId": "63f8e9b3d3c4f5g6h7i8j9k0"
}
```

**Response:** (201)

```json
{
  "success": true,
  "message": "Added to favorites",
  "data": {
    "_id": "63f8e9b3d3c4f5g6h7i8j9k0",
    "user": "63f8e9b3d3c4f5g6h7i8j9k1",
    "property": "63f8e9b3d3c4f5g6h7i8j9k0",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

---

### Remove from Favorites (Protected)

**DELETE** `/favorites/:propertyId`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** (200)

```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

---

### Check if Property is Favorited (Protected)

**GET** `/favorites/check/:propertyId`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** (200)

```json
{
  "success": true,
  "isFavorite": true
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Invalid input data"
}
```

### 401 Unauthorized

```json
{
  "message": "No token, authorization denied"
}
```

### 403 Forbidden

```json
{
  "message": "Not authorized to access this route"
}
```

### 404 Not Found

```json
{
  "message": "Property not found"
}
```

### 500 Server Error

```json
{
  "message": "Something went wrong!"
}
```

---

## Rate Limiting

No rate limiting is currently implemented. For production, implement rate limiting using:

- `express-rate-limit` package
- Recommended: 100 requests per 15 minutes per IP

---

## Pagination

All list endpoints support pagination:

- Default limit: 10-12 items per page
- Maximum limit: 100 items
- Returns: `total`, `pages`, `currentPage`, `count`

---

## Sorting

Properties endpoint supports sorting:

- `-createdAt` (newest first) - default
- `createdAt` (oldest first)
- `-rent` (highest rent)
- `rent` (lowest rent)
- `-views` (most viewed)
- `title` (alphabetical)

---

## Testing with cURL

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "9876543210",
    "role": "tenant"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Properties

```bash
curl -X GET "http://localhost:5000/api/properties?city=Mumbai&page=1"
```

---

**Last Updated: January 2024**
