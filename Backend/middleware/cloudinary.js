// Upload image to cloudinary
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "shopmodern/products",
    allowed_formats: ["jpg", "png", "webp"],
  },
});

export default storage;
