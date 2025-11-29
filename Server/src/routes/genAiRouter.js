import express from "express";
import { genAI } from "../controllers/genAI.js";

const router = express.Router();

router.post('/generate', genAI);

export default router;