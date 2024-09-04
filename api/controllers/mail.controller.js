import { catchAsync } from "../utils/catchAsync.js";
import { sendUserEmail } from "../utils/email.js";

export const userMail = catchAsync(async(req,res)=>{
    const {name,email,phone,emailSubject,content} = req.body;
    console.log(req.body)
    const sub = `Mail from ${email}`
    const thanks = "Thank you for contacting us. Alester will contact you very soon."
    const result = await sendUserEmail({name,email,sub,thanks})
    res.json(result);
})