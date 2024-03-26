import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const updateUser = catchAsync(async(req,res,next)=>{
    if(req.params.userid !== req.user._id.toString()){
        return next(new AppError("You are not allowed to update the user",404))
    }
    if(req.body.username){
        console.log(req.body.username.length)
        if(req.body.username.length <7 || req.body.username.length > 20){
            console.log("hello")
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
    const {password,...rest} = updatedUser
    res.status(200).json(rest)
})

export const deleteUser = async(req,res,next)=>{
    const id = req.params.userId
    const result = await User.findByIdAndDelete(id)
    if (!result) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({message : "Deleted successfully"})
}

export const getUsers = catchAsync(async(req,res,next)=>{
    const startIndex = parseInt(req.query.startIndex) || 0
    const sortDirection = (req.query.sortDirection === "asc" ? 1:-1)
    const limit = parseInt(req.query.limit) || 9
    const result = await User.find({
        ...(req.query.userId && {_id: req.query.userId}),
        ...(req.query.category && {category : req.query.category}),
        ...(req.query.slug && {slug : req.query.slug}),
        ...(req.query.searchTerm  && {
            $or : [
                { title : {$regex : req.query.title,$option : 'i'}},
                { content : {$regex : req.query.title,$option : 'i'}}
            ]
        })
    }).sort({updatedAt : sortDirection})
    .skip(startIndex)
    .limit(limit)
    console.log(result)
    const totalDoc = await User.countDocuments();
    const now = new Date()
    const date = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    )
    const lastMonthDoc = await User.countDocuments({
        createdAt : {$gte : date},
    })
    res.status(200).json({
        result,
        totalDoc,
        lastMonthDoc
    })
})