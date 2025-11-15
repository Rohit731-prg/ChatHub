import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { uploadImage } from "../utils/uploadImage.js";
import { io, onlineUsers } from "../index.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const user_id = req.user._id;
        const users_list = await User.find({ _id: { $ne: user_id } }).select("-password");
        const user_with_messageCount = [];
        users_list.map(async(user) => {
            const messageCount = await Message.countDocuments({ sender: user_id, receiver: user._id, seen: false });
            user_with_messageCount.push({ user, messageCount });
        });

        return res.status(200).json({ user_with_messageCount });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    const { id } = req.params;
    const { message, image } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required." });

    try {
        const sender_id = req.user._id;
        const is_exist = await User.findById(id);
        if (!is_exist) return res.status(404).json({ message: "User not found." });
        let imageUrl = "";
        let newMessage = null;
        if (image) {
            const { url, image_id } = await uploadImage(image.buffer);
            req.imageUrl = url;
            req.imageId = image_id;
            imageUrl = url;
            newMessage = new Message({ sender: sender_id, receiver: id, message, image: imageUrl });
        }

        newMessage = new Message({ sender: sender_id, receiver: id, message });
        await newMessage.save();

        // emit the new message to reverser's socket
        const recevierSocketID = onlineUsers[id];
        if (recevierSocketID) {
            io.to(recevierSocketID).emit("newMessage", newMessage);
        }

        return res.status(201).json({ message: "Message sent successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getMessagesByUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user_id = req.user._id;
        const messages = await Message.find({ $or: [{ sender: user_id, receiver: id }, { sender: id, receiver: user_id }] }).sort({ createdAt: -1 });
        if (!messages) return res.status(404).json({ message: "No messages found" });
        await Message.updateMany({ sender: id, receiver: user_id }, { seen: true });
        return res.status(200).json({ messages });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}