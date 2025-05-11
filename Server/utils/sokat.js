import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Adjust this URL as needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const userSocketMap = {};  // Maps user ID to socket ID

export function getReceiverSocketID(userID) {
  return userSocketMap[userID];
}

io.on("connection", (socket) => {
  console.log("user connected ", socket.id);

  // Get the user ID from the query string
  const userID = socket.handshake.query.userID;
  console.log('userID', userID);
  if (userID) {
    userSocketMap[userID] = socket.id;
  }

  // Emit the list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for incoming message
  // socket.on("sendMessage", (data) => {
  //   console.log("Received message:", data);
  //   const receiverSocketId = getReceiverSocketID(data.receiverId);
  //   if (receiverSocketId) {
  //     io.to(receiverSocketId).emit("newMessage", data);  // Send the message to the receiver
  //   }
  // });

  socket.on("disconnect", () => {
    console.log("user disconnected ", socket.id);
    delete userSocketMap[userID]; 
    io.emit("getOnlineUsers", Object.keys(userSocketMap));  
  });
});

export { io, server, app };
