import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWToken } from "../utils/generateJWToken.js";
import { sendResetPasswordEmail, sendResetPasswordSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../resend/email.js";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";


export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error checking auth", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const existingUser = await User.findOne({ verificationToken: code, verificationTokenExpiresAt: { $gt: Date.now() } });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid token" });
        }
        existingUser.isVerified = true;
        existingUser.verificationToken = undefined;
        existingUser.verificationTokenExpiresAt = undefined;
        await existingUser.save();
        await sendWelcomeEmail(existingUser.email, existingUser.name);
        res.status(200).json({ success: true, message: "Email verified successfully" });
    }
    catch (error) {
        console.log("Error verifying email", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const user = new User({ name, email, password: hashedPassword, verificationToken, verificationTokenExpiresAt });
        await user.save();

        // JWT 
        generateJWToken(res, user._id);

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
                resetPasswordToken: undefined,
                resetPasswordExpiresAt: undefined,
            },
        });
    } catch (error) {
        console.log("Error creating user", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email }).select("+password");
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }
        if (!existingUser.isVerified) {
            return res.status(400).json({ message: "Email not verified" });
        }
        // JWT 
        generateJWToken(res, existingUser._id);
        res.status(200).json({ success: true, message: "Logged in successfully" });
    } catch (error) {
        console.log("Error logging in", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }
        const resetPasswordToken = generateResetPasswordToken();
        const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
        existingUser.resetPasswordToken = resetPasswordToken;
        existingUser.resetPasswordExpiresAt = resetPasswordExpiresAt;
        await existingUser.save();
        await sendResetPasswordEmail(existingUser.email, existingUser.name, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);
        res.status(200).json({ success: true, message: "Reset password token sent successfully" });
    } catch (error) {
        console.log("Error forgot password", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const existingUser = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid token" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.resetPasswordToken = undefined;
        existingUser.resetPasswordExpiresAt = undefined;
        await existingUser.save();
        await sendResetPasswordSuccessEmail(existingUser.email, existingUser.name);
        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("Error resetting password", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
