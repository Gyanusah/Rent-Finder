import express from "express";
const router = express.Router();

import {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    sendInquiry,
    getPropertiesByOwner,
    deletePropertyImage,
    getMyProperties,
} from "../controllers/propertyController.js";

import { auth, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

// Public routes
router.get("/", getProperties);
router.get("/:id", getPropertyById);

// Protected route for current user's properties
router.get("/owner/my-properties", auth, getMyProperties);

// Public route for properties by specific owner
router.get("/owner/:ownerId", getPropertiesByOwner);

router.post(
    "/",
    auth,
    upload.array("images", 10),
    createProperty
);

router.put("/:id", auth, upload.array("images", 10), updateProperty);
router.delete("/:id", auth, deleteProperty);
router.post("/:id/inquiry", auth, sendInquiry);
router.delete("/:id/image", auth, deletePropertyImage);

export default router;
