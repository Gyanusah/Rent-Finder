// @route   GET /api/properties/owner/my-properties
// @desc    Get all properties for the current logged-in owner
// @access  Private
exports.getMyProperties = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const properties = await Property.find({ owner: req.user.id })
            .skip(skip)
            .limit(Number(limit))
            .populate('owner', 'name email phone');

        const total = await Property.countDocuments({ owner: req.user.id });

        res.status(200).json({
            success: true,
            count: properties.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: properties,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const fs = require('fs');
const path = require('path');

// @route   POST /api/properties
// @desc    Create a property
// @access  Private (owner/admin)
exports.createProperty = async (req, res) => {
    try {
        const {
            title,
            description,
            address,
            city,
            area,
            pincode,
            latitude,
            longitude,
            rent,
            deposit,
            maintenance,
            propertyType,
            roomType,
            roomCount,
            bathrooms,
            furnishing,
            floor,
            roomSize,
            balcony,
            amenities,
            rules,
            familyAllowed,
            bachelorAllowed,
            availableFrom,
        } = req.body;

        // Add uploaded images
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map((file) => ({
                url: `/uploads/${file.filename}`,
                uploadedAt: new Date(),
            }));
        }

        // Helper function to parse boolean strings
        const parseBoolean = (val) => {
            if (typeof val === 'boolean') return val;
            if (val === 'true') return true;
            if (val === 'false') return false;
            return !!val;
        };

        // Helper function to parse JSON safely
        const parseJSON = (val) => {
            if (!val) return {};
            if (typeof val === 'object') return val;
            try {
                return JSON.parse(val);
            } catch (e) {
                console.error('JSON parse error:', e, 'for value:', val);
                return {};
            }
        };

        const property = new Property({
            title,
            description,
            address,
            city,
            area,
            pincode,
            latitude,
            longitude,
            rent: Number(rent),
            deposit: Number(deposit),
            maintenance: maintenance ? Number(maintenance) : 0,
            propertyType,
            roomType,
            roomCount: roomCount ? Number(roomCount) : null,
            bathrooms: parseJSON(bathrooms),
            furnishing,
            floor: parseJSON(floor),
            roomSize: parseJSON(roomSize),
            balcony: parseBoolean(balcony),
            amenities: parseJSON(amenities),
            rules: parseJSON(rules),
            familyAllowed: parseBoolean(familyAllowed),
            bachelorAllowed: parseBoolean(bachelorAllowed),
            images,
            owner: req.user.id,
            availability: {
                available: true,
                availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
            },
        });

        await property.save();

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: property,
        });
    } catch (error) {
        // Delete uploaded files if property creation fails
        if (req.files) {
            req.files.forEach((file) => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error('File error:', err);
                });
            });
        }
        console.error('Property creation error:', error);
        res.status(400).json({ message: error.message || 'Error creating property' });
    }
};

// @route   GET /api/properties
// @desc    Get all properties with search and filter
// @access  Public
exports.getProperties = async (req, res) => {
    try {
        let {
            city,
            area,
            propertyType,
            furnishing,
            minRent,
            maxRent,
            familyAllowed,
            bachelorAllowed,
            amenities,
            page = 1,
            limit = 12,
            sort = '-createdAt',
        } = req.query;

        // Ensure pagination values are numbers
        page = Number(page) || 1;
        limit = Number(limit) || 12;

        let filter = { 'availability.available': true };

        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }

        if (area) {
            filter.area = { $regex: area, $options: 'i' };
        }

        if (propertyType) {
            filter.propertyType = propertyType;
        }

        if (furnishing) {
            filter.furnishing = furnishing;
        }

        if (minRent || maxRent) {
            filter.rent = {};
            if (minRent) filter.rent.$gte = Number(minRent);
            if (maxRent) filter.rent.$lte = Number(maxRent);
        }

        if (familyAllowed !== undefined) {
            filter.familyAllowed = familyAllowed === 'true';
        }

        if (bachelorAllowed !== undefined) {
            filter.bachelorAllowed = bachelorAllowed === 'true';
        }

        if (amenities) {
            const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
            const amenitiesFilter = {};
            amenitiesArray.forEach((amenity) => {
                amenitiesFilter[`amenities.${amenity}`] = true;
            });
            Object.assign(filter, amenitiesFilter);
        }

        const skip = (page - 1) * limit;

        // Log the filter and pagination for debugging
        console.log('Fetching properties with filter:', JSON.stringify(filter), 'page:', page, 'limit:', limit, 'sort:', sort);

        let properties;
        try {
            properties = await Property.find(filter)
                .populate('owner', 'name email phone')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit));
        } catch (err) {
            console.error('Error querying properties:', err);
            const payload = { message: 'Database query error while fetching properties', error: err.message };
            if (process.env.NODE_ENV !== 'production') {
                payload.stack = err.stack;
                payload.filter = filter;
                payload.page = page;
                payload.limit = limit;
                payload.sort = sort;
            }
            return res.status(500).json(payload);
        }

        let total;
        try {
            total = await Property.countDocuments(filter);
        } catch (err) {
            console.error('Error counting properties:', err);
            const payload = { message: 'Database query error while counting properties', error: err.message };
            if (process.env.NODE_ENV !== 'production') {
                payload.stack = err.stack;
                payload.filter = filter;
                payload.page = page;
                payload.limit = limit;
                payload.sort = sort;
            }
            return res.status(500).json(payload);
        }

        res.status(200).json({
            success: true,
            count: properties.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: properties,
        });
    } catch (error) {
        console.error('Get properties error:', error);
        const payload = { message: error.message || 'Error fetching properties' };
        if (process.env.NODE_ENV !== 'production') {
            payload.stack = error.stack;
            payload.filter = typeof filter !== 'undefined' ? filter : null;
            payload.page = typeof page !== 'undefined' ? page : null;
            payload.limit = typeof limit !== 'undefined' ? limit : null;
            payload.sort = typeof sort !== 'undefined' ? sort : null;
        }
        res.status(500).json(payload);
    }
};

// @route   GET /api/properties/:id
// @desc    Get property by id
// @access  Public
exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('owner', 'name email phone bio address');

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json({
            success: true,
            data: property,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private (owner of property)
exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check authorization
        if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this property' });
        }

        // Helper function to parse boolean strings
        const parseBoolean = (val) => {
            if (typeof val === 'boolean') return val;
            if (val === 'true') return true;
            if (val === 'false') return false;
            return !!val;
        };

        // Helper function to parse JSON safely
        const parseJSON = (val) => {
            if (!val) return {};
            if (typeof val === 'object') return val;
            try {
                return JSON.parse(val);
            } catch (e) {
                console.error('JSON parse error:', e, 'for value:', val);
                return {};
            }
        };

        const updateData = req.body;

        // Convert numeric fields
        if (updateData.rent) updateData.rent = Number(updateData.rent);
        if (updateData.deposit) updateData.deposit = Number(updateData.deposit);
        if (updateData.maintenance) updateData.maintenance = Number(updateData.maintenance);
        if (updateData.roomCount) updateData.roomCount = Number(updateData.roomCount);

        // Parse JSON fields if provided
        if (updateData.bathrooms) updateData.bathrooms = parseJSON(updateData.bathrooms);
        if (updateData.floor) updateData.floor = parseJSON(updateData.floor);
        if (updateData.roomSize) updateData.roomSize = parseJSON(updateData.roomSize);
        if (updateData.amenities) updateData.amenities = parseJSON(updateData.amenities);
        if (updateData.rules) updateData.rules = parseJSON(updateData.rules);

        // Parse boolean fields
        if (updateData.balcony !== undefined) updateData.balcony = parseBoolean(updateData.balcony);
        if (updateData.familyAllowed !== undefined) updateData.familyAllowed = parseBoolean(updateData.familyAllowed);
        if (updateData.bachelorAllowed !== undefined) updateData.bachelorAllowed = parseBoolean(updateData.bachelorAllowed);

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => ({
                url: `/uploads/${file.filename}`,
                uploadedAt: new Date(),
            }));
            updateData.images = [...(property.images || []), ...newImages];
        }

        property = await Property.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            data: property,
        });
    } catch (error) {
        console.error('Property update error:', error);
        res.status(400).json({ message: error.message || 'Error updating property' });
    }
};

// @route   DELETE /api/properties/:id
// @desc    Delete property
// @access  Private (owner of property)
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check authorization
        if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this property' });
        }

        // Delete images
        if (property.images && property.images.length > 0) {
            property.images.forEach((image) => {
                const imagePath = path.join(__dirname, '..', image.url);
                fs.unlink(imagePath, (err) => {
                    if (err) console.log(err);
                });
            });
        }

        // Delete related favorites
        await Favorite.deleteMany({ property: property._id });

        await Property.findByIdAndRemove(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Property deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   POST /api/properties/:id/inquiry
// @desc    Send inquiry for a property
// @access  Private
exports.sendInquiry = async (req, res) => {
    try {
        const { message } = req.body;

        const property = await Property.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    inquiries: {
                        user: req.user.id,
                        message,
                        createdAt: new Date(),
                    },
                },
            },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Inquiry sent successfully',
            data: property,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/properties/owner/:ownerId
// @desc    Get all properties by owner
// @access  Public
exports.getPropertiesByOwner = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const properties = await Property.find({ owner: req.params.ownerId })
            .skip(skip)
            .limit(Number(limit))
            .populate('owner', 'name email phone');

        const total = await Property.countDocuments({ owner: req.params.ownerId });

        res.status(200).json({
            success: true,
            count: properties.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: properties,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   DELETE /api/properties/:id/image
// @desc    Delete specific image from property
// @access  Private
exports.deletePropertyImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check authorization
        if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this image' });
        }

        // Delete image file
        const imagePath = path.join(__dirname, '..', imageUrl);
        fs.unlink(imagePath, (err) => {
            if (err) console.log(err);
        });

        // Remove image from property
        property.images = property.images.filter((img) => img.url !== imageUrl);
        await property.save();

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            data: property,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
