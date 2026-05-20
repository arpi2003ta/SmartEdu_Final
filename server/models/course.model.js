import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:true
    },
    subTitle: {type:String}, 
    description:{ type:String},
    category:{
        type:String,
        required:true
    },
    courseLevel:{
        type:String,
        enum:["Beginner", "Medium", "Advance"]
    },
    coursePrice:{
        type:Number
    },
    courseThumbnail:{
        type:String
    },
    enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    lectures:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    review:[
        {
            user:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
            comment:{type:String, required:true},
            createdAt:{type:Date, default:Date.now()},
            rating:{type:Number, min:1,max:5},
            updatedAt:{type:Date}
        },
    ]

}, {timestamps:true});

export const Course = mongoose.model("Course", courseSchema);