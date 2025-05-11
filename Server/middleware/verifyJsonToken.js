import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyJsonToken = async (req, res, next) => {
    const { token } = req.cookies;
    console.log('token', token);
    if (!token) {
        return res.status(200).json({
            success: false,
            message: "Unauthorized"
        })
    }    
    try {
        const decode = JWT.verify(token, process.env.JWT_CODE);
        req.email = decode.email;
        console.log('decode', decode);
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}