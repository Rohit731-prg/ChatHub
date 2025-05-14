import Message from "../models/message.model.js";
import User from '../models/user.model.js';
import cloudinary from '../../config/cloudinary.js';
import { getReceiverSocketID, io } from "../../utils/sokat.js";

export const getUserForUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  try {
    const users = await User.find({ _id: { $ne: id } });
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error from server: ${error}`,
    });
  }
};

export const getMessages = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  if (!id || !user) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  try {
    const messages = await Message.find({
      $or: [
        { sender: id, receiver: user },
        { sender: user, receiver: id },
      ],
    }).sort({ updatedAt: 1 });

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error from server: ${error}`,
    });
  }
};


export const sendMessage = async (req, res) => {
    const { id } = req.params;
    const { user, message, image } = req.body;
    if(!id || !user){
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        })
    }
    try {
        let imageURL;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            sender: id,
            receiver: user,
            message: message,
            image: imageURL
        })
        await newMessage.save();

        const receiverSocketID = getReceiverSocketID(user);
        if(receiverSocketID) {
            io.to(receiverSocketID).emit("newMessage", newMessage);
        }

        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            sendMessage: newMessage
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error from server: ${error}`
        })   
    }
}