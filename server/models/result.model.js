import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    attemptId:{type: mongoose.Schema.Types.ObjectId,ref:"Response", required:true},
    studentId:{type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    score: {type:Number, required:true},
    correctCount:{type:Number, required:true},
    incorrectCount:{type:Number, required:true},
    unattemptedCount:{type:Number, required:true},
    subjectWiseScore:[
        {
            subject:{type:String, enum:["Physics","Chemistry","Maths"]},
            Score:Number
        }
    ],
    subjectWiseTimeSpent:[
        {
            subject:{type:String,enum:["Physics","Chemistry","Maths"] },
            timeSpent: Number 
        }
    ]
});

export const Result = mongoose.model("Result",resultSchema);