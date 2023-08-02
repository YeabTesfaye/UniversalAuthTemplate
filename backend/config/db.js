import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()
mongoose.set("strictQuery", false)

export const CONNECTDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected ${conn.connection.host}`.cyan);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}