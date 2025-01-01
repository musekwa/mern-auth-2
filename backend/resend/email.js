import { resend } from "./config.js";
import { VERIFICATION_TOKEN_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, RESET_PASSWORD_EMAIL_TEMPLATE } from "./email.templates.js";

export const sendResetPasswordSuccessEmail = async (email, name) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Password reset successfully",
            html: `<p>Hello ${name},</p><p>Your password has been reset successfully.</p><p>If you did not request this change, please contact support immediately.</p>`
        });
    }
    catch (error) {
        console.log("Error sending reset password success email", error);
        throw new Error("Error sending reset password success email");
    }
}

export const sendResetPasswordEmail = async (email, name, resetPasswordLink) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Reset your password",
            html: RESET_PASSWORD_EMAIL_TEMPLATE.replace("{resetPasswordLink}", resetPasswordLink).replace("{name}", name)
        });
    }
    catch (error) {
        console.log("Error sending reset password email", error);
        throw new Error("Error sending reset password email");
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Welcome to our app",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name)
        });
    }
    catch (error) {
        console.log("Error sending welcome email", error);
        throw new Error("Error sending welcome email");
    }
}

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Verify your email address",
            html: VERIFICATION_TOKEN_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken)
        });
    }
    catch (error) {
        console.log("Error sending verification email", error);
        throw new Error("Error sending verification email");
    }
}