const express = require('express');
const router = express.Router();
const {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    sendInquiry,
    getPropertiesByOwner,
    deletePropertyImage,
} = require('../controllers/propertyController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Protected route for current user's properties
const { getMyProperties } = require('../controllers/propertyController');
router.get('/owner/my-properties', auth, getMyProperties);

// Public route for properties by specific owner
router.get('/owner/:ownerId', getPropertiesByOwner);

// Protected routes
router.post('/', auth, authorize('owner', 'admin'), upload.array('images', 10), createProperty);
router.put('/:id', auth, upload.array('images', 10), updateProperty);
router.delete('/:id', auth, deleteProperty);
router.post('/:id/inquiry', auth, sendInquiry);
router.delete('/:id/image', auth, deletePropertyImage);

module.exports = router;
