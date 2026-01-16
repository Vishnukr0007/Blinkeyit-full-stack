import { Router } from "express";
import auth from "../middleware/auth.js";
import uploadImageController from "../controllers/uploadImage.controller.js";
import upload from "../middleware/multer.js";

const uploadRouter=Router()

uploadRouter.post("/upload", auth, (req, res, next) => {
    upload.single("image")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                message: error.message || "File upload error",
                error: true,
                success: false
            });
        }
        next();
    });
}, uploadImageController);

export default uploadRouter