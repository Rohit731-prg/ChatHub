import express from "express";
import { login, signup, updateImage } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyJsonToken.js";
import { uploadToCloudinary } from "../middleware/multer.js";

const router = express.Router();

router.post("/signUp", signup);
router.post("/login", login);
router.put("/updateProfilePic", verifyToken, uploadToCloudinary, updateImage);
router.get("/getAllUsers", verifyToken, getAllUsers);

export default router;