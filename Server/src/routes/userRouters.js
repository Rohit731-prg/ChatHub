import express from "express";
import { login, signup, updateBIO, updateImage, verifyEmail } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyJsonToken.js";
import { upload, uploadImage } from "../middleware/multer.js";

const router = express.Router();

router.post("/signUp", upload.single("image"), uploadImage, signup);
router.put("/verifyOTP", verifyEmail);
router.post("/login", login);
router.put("/updateBIO", verifyToken, updateBIO);
router.put("/updateProfilePic", verifyToken, upload.single("image"), uploadImage, updateImage);

export default router;