import mongoose from "mongoose";

export const connectDB = async () => {
    const url = process.env.DB_URL;

    try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}