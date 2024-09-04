import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    }
},{timestamps:true})

const Notification = new mongoose.model("notificationSchema",notificationSchema);

export default Notification;