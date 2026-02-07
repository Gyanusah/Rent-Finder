import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Create unique index so a user can't like the same property twice
FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

export default mongoose.model('Favorite', FavoriteSchema);
