import express from 'express'
import { verifyToken } from '../middleware/verifyJsonToken.js';
import { getMessagesByUser, getUserForSidebar, sendMessage } from '../controllers/messageController.js';
import { upload, uploadImage } from '../middleware/multer.js';


const router = express.Router();

router.get("/getMessagesForSidebar", verifyToken, getUserForSidebar);
router.post("/sendMessage/:id", verifyToken, upload.single("image"), uploadImage, sendMessage);
router.get("/getMessagesByUser/:id", verifyToken, getMessagesByUser);

export default router;