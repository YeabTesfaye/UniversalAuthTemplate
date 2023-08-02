import 'express-async-errors'
import dotenv from 'dotenv'
import colors from 'colors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import userRouter from './route/user.js'
import authRouter from './route/auth.js'
import {CONNECTDB} from './config/db.js'

const PORT = process.env.PORT || 5000
const app = express()
dotenv.config()
CONNECTDB()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/api/v1/user",userRouter)
app.use("/api/v1/auth", authRouter)

app.listen(PORT, () => {
    console.log(`the port is running at port ${PORT}`);
})