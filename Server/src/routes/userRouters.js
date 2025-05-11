import express from "express";
import {
  createUser,
  forgotPassword,
  logIn,
  loginWtithAuth,
  logOut,
  resetPassword,
  uploadImage,
  verifyUser,
} from "../controllers/userController.js";
import { verifyJsonToken } from "../../middleware/verifyJsonToken.js";

const router = express.Router();

router.post("/signUp", createUser);
router.post("/verifyUser/:id", verifyUser);
router.post("/logIn", logIn);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);
router.get("/logOut", logOut);
router.put("/uploadImage", verifyJsonToken, uploadImage);
router.post("/loginWtithAuth", verifyJsonToken, loginWtithAuth);

export default router;
