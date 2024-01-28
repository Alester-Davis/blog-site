import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const updateUser = catchAsync(async(req,res,next)=>{
    if(req.params.userid !== req.user._id.toString()){
        return next(new AppError("You are not allowed to update the user",404))
    }
    if(req.body.username){
        console.log(req.body.username.length)
        if(req.body.username.length <7 && req.body.username.length > 20){
            return next(new AppError("Username should have length between 7 and 20",404))
        }
        if(req.body.username.includes(' ')){
            return next(new AppError("Username can't contain space",404))
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(new AppError("Username can only contain only lower case",404))
        }
        if(req.body.username.match(/^[a-zA-Z]+$/)){
            return next(new AppError("Username can only contain letters and numbers",404))
        }
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.userid,{
        $set:{
            username:req.body.username,
            profilePicture : req.body.profilePicture,
            email:req.body.user
        }
    },{new:true})
    console.log(updatedUser)
})