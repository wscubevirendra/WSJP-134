import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const uploadImage = (req, res, folder, multiple = false) => {

    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: folder,
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
    });

    const upload = multer({
        storage,
        limits: {
            fileSize: 4 * 1024 * 1024, // Maximum 4 MB
        },
    });

    return new Promise((resolve, reject) => {
        // Single or multiple image upload
        const uploader = multiple
            ? upload.array("images", 4)
            : upload.single("image");

        uploader(req, res, (error) => {
            if (error) {
                return reject(error);
            }
            resolve(multiple ? req.files : req.file);
        });
    });
};

export default uploadImage;