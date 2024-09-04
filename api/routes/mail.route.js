import express from "express";
import { userMail } from "../controllers/mail.controller.js";
const router = express.Router()

router.post("/sendUserMail",userMail);

export default router;