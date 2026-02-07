import express from "express";
const router = express.Router();
import {
    addFavorite,
    getFavorites,
    removeFavorite,
    checkFavorite,
} from "../controllers/favoriteController.js";
import { auth } from "../middleware/auth.js";

// All routes are protected
router.post('/', auth, addFavorite);
router.get('/', auth, getFavorites);
router.delete('/:propertyId', auth, removeFavorite);
router.get('/check/:propertyId', auth, checkFavorite);

export default router;
