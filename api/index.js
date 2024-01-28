import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import AppError from './utils/appError.js'
import userRoute from "./routes/user.route.js"
import { globalErrorHandler } from "./controllers/error.controller.js"
import cookieParser from "cookie-parser"
dotenv.config()
const app = express()
app.use(cors());
app.use(express.json())
app.use(cookieParser())
mongoose.connect("mongodb+srv://alesterkvp:123Alester123@cluster0.wj0paf7.mongodb.net/mern-blog").then(()=> console.log("connected to db"))

app.use("/api/auth",userRoute)
app.all("*",(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} in this server`, 404));
})
app.use(globalErrorHandler)
app.listen(4000,()=>{
    console.log(`listening to port ${4000}`)
})
