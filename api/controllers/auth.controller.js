import User from '../models/user.model.js'
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const test = (req,res)=>{
    res.json({"message" : "test"})
}

const signToken = id =>{
    return jwt.sign({id},"alester-davis")
}


const sendToken = (user, statusCode,res) =>{
    const token = signToken(user._id)
    console.log(token)
    const cookieOption = {
        httpOnly:true
    }
    res.cookie("jwt",token,cookieOption).json(user)
    user.password = undefined
    res.status(statusCode).json(user)
}
export const signup = catchAsync(async(req,res,next)=>{
    console.log(req.body)
    const {username,email,password,passwordConform} = req.body
    console.log(email)
    if(!username||!password||!passwordConform||!email||username===""||email===""||password===""||passwordConform===""){
        return next(new AppError("All fields are required!",404))
    }
    const newUser = await User.create({
        username: username,
        email: email,
        password: password,
        passwordConform : passwordConform
    })
    res.json(("Created succesfully"))
})

export const signin = catchAsync(async(req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password){
        next(new AppError("All fields are required",404))
    }
    const user = await User.findOne({email}).select("+password")
    if(!user){
        next(new AppError("User doesn't exist",404))
    }
    if(!(await user.correctPassword(user.password,password))){
        next(new AppError("Incorrect password",404))
    }
    sendToken(user,200,res)
    
})

export const googleAuth = catchAsync(async(req,res,next)=>{
    const {email,name,googlePhotoUrl} = req.body
    const user = await User.findOne({email})
    if(user){
        sendToken(user,200,res)
    }
    else{
        const newUser = {
            username:name.toLowerCase().split(" ").join('') + Math.random().toString(9).slice(-5),
            email,
            password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
            passwordConform: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
            profilePhoto : req.body.googlePhotoUrl
        }
        const resdata = await User.create(newUser)
        sendToken(resdata,200,res)
    }
})