import User from '../models/user.model.js'
import jwt from 'jsonwebtoken';

export const test = (req,res)=>{
    res.json({"message" : "test"})
}

const signToken = id =>{
    return jwt.sign({is})
}


const sendToken = (user, statusCode,res) =>{

    const cookieOption = {
        expires: new Date(90*24*60*60*1000),
        httpOnly:true
    }
}
export const signup = async(req,res,next)=>{
    const newUser = await User.create({
        username: req.body.username,
        email:req.body.email,
        password: req.body.password,
        passwordConform : req.body.passwordConform
    })
    res.json(("Created succesfully"))
}