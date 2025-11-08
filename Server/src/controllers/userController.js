import User from "../models/user.model.js";
import { comparePassword, generateHashedPassword } from "../utils/hashPassword.js";

export const signup = async (req, res) => {
    const { name, email, password, bio } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required." });

    try {
        const is_exist = await User.findOne({ email });
        if (is_exist) return res.status(409).json({ message: "User with this email already exists." });

        const hashedPassword = await generateHashedPassword(password);
        const newUser = new User({
            name, email, password: hashedPassword, bio
        });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });

        const compair = await comparePassword(password, user.password);
        if (!compair) return res.status(401).json({ message: "Invalid credentials." });
        if (!user.isVerified) return res.status(403).json({ message: "Please verify your email to login." });

        const token = generateToken({ id: user._id, email: user.email });
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

        const UserDetails = {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio,
        }
        return res.status(200).json({ message: "Login successful.", token, user: UserDetails });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateImage = async (req, res) => {
    try {
        const user = req.user;
        await User.findByIdAndUpdate(user.id, {
            profilePic: req.imageUrl,
            imageId: req.imageId
        });
        return res.status(200).json({ message: "Profile picture updated successfully.", imageUrl: req.imageUrl });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}