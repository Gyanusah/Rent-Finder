const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
        },
        address: {
            type: String,
            required: [true, 'Please provide an address'],
        },
        city: {
            type: String,
            required: [true, 'Please provide a city'],
        },
        area: {
            type: String,
            required: [true, 'Please provide an area/locality'],
        },
        pincode: {
            type: String,
            required: [false, 'Please provide a pincode'],
            match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode'],
        },
        latitude: Number,
        longitude: Number,
        rent: {
            type: Number,
            required: [true, 'Please provide rent amount'],
        },
        deposit: {
            type: Number,
            required: [true, 'Please provide security deposit amount'],
        },
        maintenance: {
            type: Number,
            default: 0,
        },
        propertyType: {
            type: String,
            enum: ['full_house', 'single_room', 'shared_room', 'pg_room'],
            required: [true, 'Please specify property type'],
        },
        roomType: {
            type: String,
            enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Single Room', 'Double Room'],
        },
        roomCount: Number,
        bathrooms: {
            total: Number,
            attached: Number,
            common: Number,
        },
        furnishing: {
            type: String,
            enum: ['furnished', 'semi-furnished', 'unfurnished'],
            required: [true, 'Please specify furnishing'],
        },
        floor: {
            current: Number,
            total: Number,
        },
        roomSize: {
            value: Number,
            unit: { type: String, enum: ['sqft', 'sqm'], default: 'sqft' },
        },
        balcony: Boolean,
        amenities: {
            wifi: Boolean,
            ac: Boolean,
            parking: Boolean,
            powerBackup: Boolean,
            waterSupply: Boolean,
            lift: Boolean,
            securityGuard: Boolean,
            gym: Boolean,
            swimming_pool: Boolean,
            garden: Boolean,
            kitchenEquipped: Boolean,
            tv: Boolean,
            refrigerator: Boolean,
            washingMachine: Boolean,
            bed: Boolean,
            wardrobe: Boolean,
            studyTable: Boolean,
        },
        rules: {
            smoking: Boolean,
            drinking: Boolean,
            pets: Boolean,
            guests: Boolean,
            cooking: Boolean,
        },
        familyAllowed: {
            type: Boolean,
            default: true,
        },
        bachelorAllowed: {
            type: Boolean,
            default: true,
        },
        availability: {
            available: {
                type: Boolean,
                default: true,
            },
            availableFrom: Date,
            rented: {
                type: Boolean,
                default: false,
            },
        },
        images: [
            {
                url: String,
                uploadedAt: { type: Date, default: Date.now },
            },
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        inquiries: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                message: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 },
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Index for search and filtering
PropertySchema.index({ city: 1, area: 1 });
PropertySchema.index({ rent: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ owner: 1 });
PropertySchema.index({ 'availability.available': 1 });

module.exports = mongoose.model('Property', PropertySchema);
