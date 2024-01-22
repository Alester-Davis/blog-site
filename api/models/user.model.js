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
    },
    profilePicture:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
},{timestamps:true})

user.pre("save",async function(next){
    this.password = await bcryptjs.hash(this.password,12)
    this.passwordConform = undefined
    next()
})

user.methods.correctPassword = async function(candidatePass,userPass){
    return await bcryptjs.compareSync(userPass,candidatePass)
}
const User = new mongoose.model("User",user)

export default User