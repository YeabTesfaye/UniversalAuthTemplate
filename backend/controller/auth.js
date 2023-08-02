import { PasswordResetToken } from "../models/passwordResetToken.js";
import { User } from "../models/user.js";
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../error/error.js";

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "The user is Not Found" });
        }

        const token = crypto.randomBytes(20).toString("hex");
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // expire after 1 hour

        await PasswordResetToken.create({
            email,
            token,
            expires,
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_FROM,
                pass: process.env.SMTP_PASS,
            },
        });
        const link = process.env.CLIENT_URL + "/resetpassword" + `/${token}`;
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Password Reset Request - Language Identification",
            html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #007bff;">Language Identification</h2>
            <p>Hello,</p>
            <p>You are receiving this email because you requested a password reset for your account.</p>
            <p>Please click on the following link to reset your password:</p>
            <p style="margin: 20px 0; text-align: center;">
              <a
                style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;"
                href=${link}
              >
                Reset Password
              </a>
            </p>
            <p>If you did not request this, please ignore this email, and your password will remain unchanged.</p>
            <p>Thank you,</p>
            <p>Your Language Identification Team</p>
          </div>
        `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                throw new BadRequestError("Something Went Wrong");
            } else {
                console.log("Email Sent", info.response);
            }
        });


        return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.log(error);
        throw new BadRequestError("something Went Wrong")
    }
};



export const resetPassword = async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "A password Filed is requried"
        })
    }
    const { token } = req.params
    const passwordReset = await PasswordResetToken.findOne({ token });


    if (!passwordReset) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
    }

    if (passwordReset.expires < new Date()) {
        await passwordReset.remove();
        return res.status(StatusCodes.BadRequestError).json({ message: "Token has expired" });
    }
    const user = await User.findOne({ email: passwordReset.email });

    if (!user) {
        await passwordReset.remove();
        return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
    const hasedPassword = await bcrypt.hash(password, 10)
    user.password = hasedPassword
    await user.save()
    await passwordReset.remove()
    return res.status(StatusCodes.OK).json({
        msg: "the password updated sucessfully"
    })
};

export const verifyEmail = async (req, res) => {
    const token = req.query.token;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Verification Token" });
    }

    // Check if the verification token has expired
    if (user.verificationTokenExpires && user.verificationTokenExpires < Date.now()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Verification Token has expired" });
    }
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined; // Remove the expiration date after verification
    await user.save();
    res.redirect('http://localhost:5173/home');
};
