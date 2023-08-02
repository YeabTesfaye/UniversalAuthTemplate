import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../models/user.js'
import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../error/error.js'
import nodemailer from 'nodemailer'
export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                msg: "User Already Exists",
            });
        }

        const verificationToken = crypto.randomBytes(20).toString("hex");
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            verificationToken,
            password: hashedPassword,
        });

        user.verificationTokenExpires = Date.now() + 3600 * 1000; // Set the expiration to 1 hour from now

        const verificationUrl = process.env.CLIENT_URL + "/verifyemail" + `?token=${verificationToken}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_FROM,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: "Email Verification",
            html: `
              <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial, sans-serif;">
                <h2 style="color: #333;">Hello ${firstName},</h2>
                <p style="color: #666;">Thank you for registering on our Language Identification website!</p>
                <p style="color: #666;">Please verify your email by clicking the link below:</p>
                <a style="display: block; margin-top: 10px; color: #007bff; text-decoration: none;" href=${verificationUrl}>Verify Email</a>
                <p style="color: #666;">If you didn't register on our website, please ignore this email.</p>
                <p style="color: #666;">Best regards,<br />The Language Identification Team</p>
              </div>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new BadRequestError("Something goes wrong with sending email");
            } else {
                console.log("Email Sent", info.response);
            }
        });

        res.status(StatusCodes.CREATED).json({
            msg : 'Registerd Sucessfully'
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "Internal Server Error",
        });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!password || !email) {
        throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found");
    }
   
    if (!user.isEmailVerified) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "Not verified email",
        });
    }
    const isMathch = await bcrypt.compare(password, user.password)
    if (isMathch) {
        return res.status(200).json({
            user,
            token: generateToken(user._id),
        });
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            msg: 'Authorization failed',
        });
    }
};



// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "12d",
    });
}