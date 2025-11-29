import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { comparePassword, generateHashedPassword } from "../utils/hashPassword.js";
import { sendEmail } from "../utils/sendEmail.js";

export const signup = async (req, res) => {
    const { name, email, password, bio } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required." });

    try {
        const is_exist = await User.findOne({ email });
        if (is_exist) return res.status(409).json({ message: "User with this email already exists." });

        const hashedPassword = await generateHashedPassword(password);
        const otp = Math.floor(100000 + Math.random() * 900000);
        if (!bio) bio = "I am using Echo.";
        const newUser = new User({
            name, email, password: hashedPassword, bio, isVerified: false, verificationCode: otp, profilePic: req.fileUrl
        });
        await newUser.save();
        await sendEmail(email, "Verify your email", `Your verification code is ${otp}`);
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

        const compare = await comparePassword(password, user.password);
        if (!compare) return res.status(401).json({ message: "Invalid credentials." });
        if (!user.isVerified) return res.status(403).json({ message: "Please verify your email to login." });

        const token = generateToken({ id: user._id, email: user.email });

        const UserDetails = await User.findById(user._id).select("-password");
        return res.status(200).json({ message: "Login successful.", token, user: UserDetails });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const verifyEmail = async () => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

    try {
        const user = await User.findOne({ email });
        if (!user ) return res.status(404).json({ message: "User not found." });

        if (user.verificationCode !== otp) return res.status(400).json({ message: "Invalid OTP." });

        user.isVerified = true;
        await user.save();
        return res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateImage = async (req, res) => {
    try {
        const user = req.user;
        await User.findByIdAndUpdate(user.id, {
            profilePic: req.imageUrl,
            imageId: req.imageId
        });
        return res.status(200).json({ message: "Profile picture updated successfully.", imageUrl: req.fileUrl });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateBIO = async (req, res) => {
    const { bio } = req.body;
    try {
        const user = req.user;
        await User.findByIdAndUpdate(user.id, { bio });
        return res.status(200).json({ message: "Bio updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}