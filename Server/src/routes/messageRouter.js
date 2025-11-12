import express from 'express'
import { verifyToken } from '../middleware/verifyJsonToken';
import { getMessagesByUser, getUserForSidebar, sendMessage } from '../controllers/messageController';
import { upload, uploadImage } from '../middleware/multer';


const router = express.Router();

router.get("/getMessagesForSidebar", verifyToken, getUserForSidebar);
router.post("/sendMessage/:id", verifyToken, upload.single("image"), uploadImage, sendMessage);
router.get("/getMessagesByUser/:id", verifyToken, getMessagesByUser);

export default router;