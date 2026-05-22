import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary"; // default import
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "rent_finder",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage });

export default upload;