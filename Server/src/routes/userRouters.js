import express from "express";
import { getAllUsers, login, signup, updateImage } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyJsonToken.js";
import { upload, uploadImage } from "../middleware/multer.js";

const router = express.Router();

router.post("/signUp", signup);
router.post("/login", login);
router.put("/updateProfilePic", verifyToken, upload.single("image"), uploadImage, updateImage);
router.get("/getAllUsers", verifyToken, getAllUsers);

export default router;