import mongoose from "mongoose";
const { Schema } = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required'],
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: [true, 'last name is required'],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            , 'invalid email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken : {
        type:String,
        required : false
    },
    verificationTokenExpires: {
        type: Date,
        required: false,
    },
})

export const User = mongoose.model("user", userSchema)
