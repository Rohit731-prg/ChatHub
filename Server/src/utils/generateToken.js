import JWT from "jsonwebtoken";

export const generateToken = (payload) => {
    return JWT.sign(payload, process.env.JWT_CODE, { expiresIn: '7d' });
}