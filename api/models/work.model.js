import mongoose from "mongoose";

const workSchema = new mongoose.Schema({
    typeOfWork:{
        type:String,
        enum: {
            values: ['project', 'experience', 'publications'],
            message: '{VALUE} is not supported. TypeOfWork must be "project", "experience", or "publications".'
        },
        required:[true,"TypeOfWork can't be empty!!"]
    },
    title:{
        type:String,
        required:[true,"Title can't be empty!!"]
    },
    domain:{
        type:String,
        required:[true,"TypeOfWork can't be empty!!"]
    },
    techStack:{
        type:[String],
        required:[true,"TechStack can't be empty"]
    },
    startDate:{
        type:Date,
        required:[true,"StartDate is required"]
    },
    endDate:{
        type:Date,
    },
    image:{
        type:String,
        default:"https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    slug:{
        type:String,
        required:[true,"Slug is required!!"]
    }
},{timestamps:true})

const Work = new mongoose.model("Work",workSchema)

export default Work