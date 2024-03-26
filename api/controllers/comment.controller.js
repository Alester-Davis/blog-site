import Comment from "../models/comment.model.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createComment = catchAsync(async(req,res,next)=>{
    console.log(req.body)
    const {content,postId,userId} = req.body
    if(JSON.stringify(userId)  !== JSON.stringify(req.user._id)){
        res.status(404).json("You are not allowed to create comment")
        return;
    }
    const newComment = await Comment.create({
        content,
        postId,
        userId
    })
    res.status(200).json(newComment);
})

export const getPostComment = catchAsync(async(req,res,next)=>{
    const comments = await Comment.find({postId:req.params.postId}).sort({
        createdAt:-1
    })
    res.status(202).json(comments)
})

export const likeComment = catchAsync(async(req,res,next)=>{
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        return next(new AppError("Comment not found",404))
    }
    const userIndex = comment.likes.indexOf(req.user._id)
    if(userIndex == -1){
        comment.noOfLikes += 1
        comment.likes.push(req.user._id)
    }
    else{
        comment.noOfLikes -= 1
        comment.likes.splice(comment.likes.indexOf(req.user._id),1)
    }
    await comment.save()
    res.status(200).json(comment)
})

export const editComment = catchAsync(async(req,res,next)=>{
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        return next(new AppError("Comment not found",404))
    }
    if(JSON.stringify(req.user._id) !== JSON.stringify(req.params.userId)){
        return next(new AppError("You are not allowed to edit the comment",404))
    }
    const updatecomment = await Comment.findByIdAndUpdate(req.params.commentId,{content:req.body.content},{new:true})
    res.status(200).json(updatecomment)

})

export const deleteComment = catchAsync(async(req,res,next)=>{
    console.log(req.params.commentId)
    const comment = await Comment.findById({_id:req.params.commentId})
    if(!comment){
        return next(new AppError("Comment not found",404))
    }
    if(JSON.stringify(req.user._id) !== JSON.stringify(req.params.userId)){
        return next(new AppError("You are not allowed to delete the comment",404))
    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json({
        message:"Deleted successfully"
    })
})


const getPostComments = catchAsync(async(req,res,next)=>{

})