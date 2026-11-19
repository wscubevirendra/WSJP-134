import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const uploadImage = (req, res, folder) => {

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

        upload.single("image")(req, res, (error) => {
            console.log(req)
            console.log(res)

            if (error) {
                return reject(error);
            }

            resolve(req.file);
        });
    });
};

export default uploadImage;