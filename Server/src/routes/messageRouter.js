import express from 'express'
import { verifyToken } from '../middleware/verifyJsonToken.js';
import { getMessagesByUser, getUserForSidebar, sendMessage } from '../controllers/messageController.js';
import { upload } from '../middleware/multer.js';
import { uploadToCloudinary } from '../utils/uploadImage.js';


const router = express.Router();

router.get("/getMessagesForSidebar", verifyToken, getUserForSidebar);
router.post("/sendMessage/:id", verifyToken, upload.single("image"), upload.single("image"), uploadToCloudinary, sendMessage);
router.get("/getMessagesByUser/:id", verifyToken, getMessagesByUser);

export default router;