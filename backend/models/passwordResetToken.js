import mongoose, { model } from "mongoose";

const passwordResetTokenSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowwercase: true
    },
    token: {
        type: String,
        required: true,
    },
    expires: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
})

export const PasswordResetToken = model("passwordResetToken", passwordResetTokenSchema)