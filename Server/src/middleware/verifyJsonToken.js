import JWT from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"];
    console.log('token', token);
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });
    try {
        const decode = JWT.verify(token, process.env.JWT_CODE);
        const user = await User.findById(decode._id);
        if (!user) return res.status(404).json({ message: "User not found." });
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}