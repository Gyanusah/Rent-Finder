import Favorite from "../models/Favorite.js";
import Property from "../models/Property.js";

// @route   POST /api/favorites
// @desc    Add property to favorites
// @access  Private
export const addFavorite = async (req, res) => {
    try {
        const { propertyId } = req.body;

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
            user: req.user.id,
            property: propertyId,
        });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Already in favorites' });
        }

        const favorite = new Favorite({
            user: req.user.id,
            property: propertyId,
        });

        await favorite.save();

        res.status(201).json({
            success: true,
            message: 'Added to favorites',
            data: favorite,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// @route   GET /api/favorites
// @desc    Get all favorite properties for user
// @access  Private
export const getFavorites = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const favorites = await Favorite.find({ user: req.user.id })
            .populate({
                path: 'property',
                populate: { path: 'owner', select: 'name email phone' },
            })
            .skip(skip)
            .limit(Number(limit))
            .sort('-createdAt');

        const total = await Favorite.countDocuments({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: favorites.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: favorites,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   DELETE /api/favorites/:propertyId
// @desc    Remove property from favorites
// @access  Private
export const removeFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findOneAndRemove({
            user: req.user.id,
            property: req.params.propertyId,
        });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Removed from favorites',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/favorites/check/:propertyId
// @desc    Check if property is favorited by user
// @access  Private
export const checkFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            user: req.user.id,
            property: req.params.propertyId,
        });

        res.status(200).json({
            success: true,
            isFavorite: !!favorite,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
