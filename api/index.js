import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import AppError from "./utils/appError.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";
import commentRoute from "./routes/comment.route.js";
import mailRoute from "./routes/mail.route.js";
import workRoute from "./routes/work.route.js";
import { globalErrorHandler } from "./controllers/error.controller.js";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();
const app = express();
const __dirname = path.resolve();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/client/dist")));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(
    "mongodb+srv://alesterkvp:123Alester123@cluster0.wj0paf7.mongodb.net/mern-blog"
  )
  .then(() => console.log("connected to db"));

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/user", userRoute);
app.use("/api/comment", commentRoute);
app.use("/api/work",workRoute);
app.use("/api/mail", mailRoute);
// app.get("*",(req,res)=>{
//     res.sendFile(path.join(__dirname,'client','dist','index.html'));
// })
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server`, 404));
});
app.use(globalErrorHandler);
app.listen(4000, () => {
  console.log(`listening to port ${4000}`);
});
