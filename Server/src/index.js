import express from "express";
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import http from "http";

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(express.json({
    limit: "4mb"
}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());


connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}).catch((err) => {
    console.log(err);
})