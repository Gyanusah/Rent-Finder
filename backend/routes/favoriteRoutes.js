const express = require('express');
const router = express.Router();
const {
    addFavorite,
    getFavorites,
    removeFavorite,
    checkFavorite,
} = require('../controllers/favoriteController');
const { auth } = require('../middleware/auth');

// All routes are protected
router.post('/', auth, addFavorite);
router.get('/', auth, getFavorites);
router.delete('/:propertyId', auth, removeFavorite);
router.get('/check/:propertyId', auth, checkFavorite);

module.exports = router;
