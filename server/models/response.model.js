import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
    examId: {type:mongoose.Schema.Types.ObjectId, ref: "Exam", required: false},
    studentId: {type:mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers:[
        {
            questionId:{type: mongoose.Schema.Types.ObjectId, ref: "Question"},
            selectedOption: {type: String}, 
            timeSpent: {type: Number, default:0}
        }
    ],
    startedAt: {type: Date, default: Date.now},
    submittedAt: {type: Date}
})

export const Response = mongoose.model("Response",responseSchema);