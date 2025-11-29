import express from 'express'
import { verifyToken } from '../middleware/verifyJsonToken.js';
import { getMessagesByUser, getUserForSidebar, sendMessage } from '../controllers/messageController.js';
import { upload } from '../middleware/multer.js';
import { uploadImageMessage } from '../middleware/messageMulter.js';


const router = express.Router();

router.get("/getMessagesForSidebar", verifyToken, getUserForSidebar);
router.post("/sendMessage/:id", verifyToken, upload.single("image"), uploadImageMessage, sendMessage);
router.get("/getMessagesByUser/:id", verifyToken, getMessagesByUser);

export default router;