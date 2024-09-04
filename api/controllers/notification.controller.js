import Notification from "../models/notification.model";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

export const addNotifcation = catchAsync(async(req,res)=>{
    const {content,userID} = req.body;
    if(JSON.stringify(userID) !== JSON.stringify(req.user._id)){
        return next(new AppError("You are not allowed to create notification",404));
    }
    const notification = await Notification.create({
        content
    })
    res.status(200).json(notification);
})

export const updateNotification = catchAsync(async(req,res)=>{
    const {content,userID} = req.body;
    const notification = await Notification.findById(req.params.notifcationId);
    if(!notification){
        return next(new AppError("No notification found with this id",404));
    }
    if(JSON.stringify(userID) !== JSON.stringify(req.user._id)){
        return next(new AppError("You are not allowed to create notification",404));
    }
    const updateNotification = await Comment.findByIdAndUpdate(req.params.notificationId,{content:req.body.content},{new:true})
    res.status(200).json(updateNotification)
})


export const deleteNotification = catchAsync(async(req,res)=>{
    const {userId} = req.body;
    const 
})