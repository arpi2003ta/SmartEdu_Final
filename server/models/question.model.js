import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({

    question:{type:String, required:true},
    questionType: {
        type:String,
        enum: ["MCQ","Integer"],
        required:true,
        default:"MCQ",
    },
    options: [
        {optionText: String, isCorrect:Boolean}
    ],
    correctAnswer:{
        type: Number,
    },
    subject: {type:String, enum:["Physics","Chemistry","Maths"],required:true},
    marks:{type:Number,default:4},
    negativeMarks:{type:Number,default:-1}
});

export const Question = mongoose.model("Question",questionSchema);