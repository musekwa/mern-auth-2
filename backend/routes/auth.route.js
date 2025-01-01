
import express from "express";
import { signup, login, logout, forgotPassword, resetPassword, verifyEmail, checkAuth } from "../controllers/auth.controller.js";
import { verifyToken } from "../midllewares/verifyToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/check-auth", verifyToken, checkAuth);



export default router;
