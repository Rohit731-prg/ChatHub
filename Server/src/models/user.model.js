import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;