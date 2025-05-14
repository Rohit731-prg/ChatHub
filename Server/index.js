import express from "express";
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import UserRouter from './src/routes/userRouters.js';
import MessageRouter from './src/routes/messageRouter.js';
import dotenv from "dotenv";
import { io, app, server } from './utils/sokat.js';

dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json({
    limit: "10mb"
}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

app.use('/api/user', UserRouter);
app.use('/api/message', MessageRouter);

connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}).catch((err) => {
    console.log(err);
})