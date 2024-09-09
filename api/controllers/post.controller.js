import Post from "../models/post.model.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ObjectId } from 'mongodb'

export const createPost = catchAsync(async(req,res,next)=>{
    console.log(req.user)
    if(req.user.role !== "admin"){
        next(new AppError("You are not allowed to create a post!!!",404))
    }
    if(!req.body.title || !req.body.content){
        next(new AppError("All fields are required!!!",404))
    }
    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g,"")
    const result = await Post.create({
        ...req.body,
        slug,
        userId:req.user._id
    })
    res.status(201).json(result)
})

export const getPost = catchAsync(async(req,res,next)=>{
    const startIndex = parseInt(req.query.startIndex) || 0
    const sortDirection = (req.query.sortDirection === "asc" ? 1:-1)
    const limit = parseInt(req.query.limit) || Infinity
    const result = await Post.find({
        ...(req.query.userId && {userId : req.query.userId}),
        ...(req.query.category && {category : req.query.category}),
        ...(req.query.slug && {slug : req.query.slug}),
        ...(req.query.postId && { _id : req.query.postId}),
        ...(req.query.searchTerm  && {
            $or : [
                { title : {$regex : req.query.searchTerm,$options : 'i'}},
                { content : {$regex : req.query.searchTerm,$options : 'i'}},
                { category : {$regex : req.query.searchTerm,$options : 'i'}}
            ]
        })
    }).sort({updatedAt : sortDirection})
    .skip(startIndex)
    .limit(limit)
    console.log(result)
    const totalDoc = (!req.query.searchTerm)?await Post.countDocuments():result.length;
    const now = new Date()
    const date = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    )
    const lastMonthDoc = await Post.countDocuments({
        createdAt : {$gte : date},
    })
    res.status(200).json({
        result,
        totalDoc,
        lastMonthDoc
    })
})

export const deletePost = catchAsync(async(req,res,next)=>{
    console.log(req.user)
    console.log(JSON.stringify(req.user._id))
    console.log(req.params.userId)
    if(req.user.role !== "admin" || JSON.stringify(req.user._id) !== JSON.stringify(req.params.userId)){
        next(new AppError("Your are not allowed to delete the post",404))
    }
    await Post.findByIdAndDelete(req.params.postId)
    res.status(200).json({message : "Deleted successfully"})
})

export const updatePost = catchAsync(async(req,res,next)=>{
    console.log(req.body.title)
    console.log(req.body.content)
    console.log(req.body.category)
    if(req.user.role !== "admin" ||  JSON.stringify(req.user._id) !== JSON.stringify(req.params.userId)){
        next(new AppError("Your are not allowed to delete the post",404))`1`
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId,{
        $set : {
            title:req.body.title,
            content:req.body.content,
            category:req.body.category,
            image:req.body.image,
            slug:req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g,"")
        }
    },{new:true})
    res.status(200).json({message : "Updated successfully",updatedPost})
})