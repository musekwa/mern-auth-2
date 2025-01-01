import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: { type: Date, select: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpiresAt: { type: Date, select: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);