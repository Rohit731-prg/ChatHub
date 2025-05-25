import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    const dbName = process.env.DB_NAME;
    const url = process.env.ONLINE_URL;

    try {
        await mongoose.connect(`${url}`);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}