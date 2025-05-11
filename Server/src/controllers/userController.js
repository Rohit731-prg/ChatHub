import cloudinary from "../../config/cloudinary.js";
import { sendEmail } from "../../utils/sendEmail.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  try {
    const isUserEixists = await User.findOne({ email });
    if (isUserEixists) {
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const emailCode = Math.floor(Math.random() * 9000).toString();
    const newUser = new User({
      name,
      email,
      password: hashedpassword,
      verificationCode: emailCode,
    });
    await newUser.save();
    const emailSubject = `Your verification code is ${emailCode}`;
    await sendEmail(email, "Email Verification", emailSubject);
    res.status(200).json({
      success: true,
      message:
        "User created successfully, check your email for verification code",
      userDetails: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error from server: ${error}`,
    });
  }
};

export const verifyUser = async (req, res) => {
  const { code } = req.body;
  const { id } = req.params;
  if (!id || !code) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verificationCode !== code) {
      return res.status(404).json({
        success: false,
        message: "Invalid verification code",
      });
    }
    await User.updateOne({ _id: id }, { isVerified: true });
    const email = user.email;

    const token = JWT.sign({
        email: email,
    }, process.env.JWT_CODE, {
        expiresIn: "1d",
    })
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // ✅ for localhost (HTTP)
      sameSite: "lax", // ✅ 'lax' works for different ports on same domain
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User verified successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error verifying user:", error); // This helps in debugging
    return res.status(500).json({
      success: false,
      message: `Error from server: ${error.message}`,
    });
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(200).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = JWT.sign({ email }, process.env.JWT_CODE, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ✅ for localhost (HTTP)
      sameSite: "lax", // ✅ 'lax' works for different ports on same domain
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      userDetails: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error from server: ${error}`,
    });
  }
};

export const uploadImage = async (req, res) => {
  const { profilePic } = req.body;

  if (!profilePic) {
    return res.status(400).json({
      success: false,
      message: "Please Upload a profile picture",
    });
  }
  try {
    const user = await User.findOne({ email: req.email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findOneAndUpdate(
      { email: req.email },
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      imageUrl: updateUser.profilePic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error from server: ${error}`,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    const emailCode = Math.floor(Math.random() * 9000).toString();
    const emailSubject = `Your verification code is ${emailCode}`;
    await sendEmail(email, "Email Verification", emailSubject);

    await User.updateOne({ email }, { verificationCode: emailCode });

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error from server: ${error}`,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verificationCode !== code) {
      return res.status(200).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    const hashedpassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedpassword });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      newPassword: hashedpassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error from server: ${error}`,
    });
  }
};

export const logOut = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "User not logged in",
      });
    }

    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error from server: ${error}`,
    });
  }
};

export const loginWtithAuth = async (req, res) => {
  console.log(req.email);
  try {
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      userDetails: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error from server: ${error}`,
    });
  }
};
