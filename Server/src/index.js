import express from "express";
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import http from "http";
import { Server } from "socket.io";
import UserRouter from './routes/userRouters.js';
import MessageRouter from './routes/messageRouter.js'
import genAiRouter from "./routes/genAiRouter.js";

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

// initilize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
});

// store online users
export const onlineUsers = {}; // { userId: socketId }

// socket handler function
io.on("connection", (socket) => {
    console.log("socket details: ", socket);
    const userID = socket.handshake.query.userID;
    console.log("user connected", userID);
    if (userID) onlineUsers[userID] = socket.id;

    // emit all users to all connected user
    io.emit("getOnlineUsers", Object.keys(onlineUsers));

    socket.on("disconnect", () => {
        console.log("user disconnected", userID);
        delete onlineUsers[userID];
        io.emit("getOnlineUsers", Object.keys(onlineUsers));
    })
})

app.use(express.json({
    limit: "4mb"
}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());



app.use("/api/user", UserRouter);
app.use("/api/message", MessageRouter);
app.use("/api/ai", genAiRouter);




connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}).catch((err) => {
    console.log(err);
})