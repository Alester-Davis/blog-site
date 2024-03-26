import User from '../models/user.model.js'
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import {promisify} from 'util'
import { decode } from 'punycode';

const signToken = id =>{
    return jwt.sign({id},"alester-davis")
}

const sendToken = (user, statusCode,res) =>{
    const token = signToken(user._id)
    console.log(token)
    const cookieOption = {
        httpOnly:true
    }
    res.cookie("jwt",token,cookieOption)
    user.password = undefined
    res.user = user
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
        passwordConform : passwordConform,
        role : req.body.role
    })
    console.log(newUser)
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
    console.log(googlePhotoUrl)
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
            profilePicture : req.body.googlePhotoUrl
        }
        const resdata = await User.create(newUser)
        sendToken(resdata,200,res)
    }
})


export const protect = catchAsync(async(req,res,next)=>{
    const token = req.cookies.jwt
    if(!token){
        return next(new AppError("Your are not logged in,Please log in again",404))
    }
    const decoded = await promisify(jwt.verify)(token, "alester-davis");
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(
          new AppError(
            'The user belonging to this token does no longer exist.',
            401
          )
        );
      }
    const {password,...rest} = currentUser._doc
    console.log(rest)
    req.user= rest
    next()
})

export const signout = (req,res,next)=>{
    res.clearCookie('jwt').json({message : "Signed Out successfully"})
}
