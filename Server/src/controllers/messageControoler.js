import User from "../models/user.model";

export const getUserForSidebar = async (req, res) => {
    try {
        const user_id = req.user._id;
        const users_list = await User.find({ _id: { $ne: user_id } }).select("-password");
        
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};