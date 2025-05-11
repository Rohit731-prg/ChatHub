import express from 'express'
import { getMessages, getUserForUser, sendMessage } from '../controllers/messageControoler.js';

const router = express.Router();

router.post('/getUserForUser/:id', getUserForUser)
router.post('/getMessages/:id', getMessages)
router.post('/sendMessage/:id', sendMessage);

export default router;