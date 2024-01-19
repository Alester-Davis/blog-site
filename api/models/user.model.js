import mongoose from "mongoose";
import bcryptjs from "bcryptjs"

const user = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please tell us your name!'],
        unique: true
    },
    email:{
        type: String,
        required: [true, 'Please provide your email'],
        unique:true
    },
    password:{
        type:String,
        required: [true, 'Please provide a password']
    },
    passwordConform:{
        type:String,
        required: [true, 'Please provide a conform password']
    }
},{timestamps:true})

user.pre("save",async function(next){
    this.password = await bcryptjs.hash(this.password,12)
    this.passwordConform = undefined
    next()
})
const User = new mongoose.model("User",user)

export default User