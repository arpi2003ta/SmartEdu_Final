import {  Response } from "../models/response.model.js";

export const startExam = async(req, res)=>{
    try{
        const studentId = req.user._id //authentication middleware se milega
        console.log(studentId);
        const attempt = await Response.create({
            studentId,
            answers:[],
            startedAt:Date.now(),
            submittedAt:null
        });

        res.status(200).json({
            attemptId:attempt._id,
            startedAt:attempt.startedAt
        })
    }catch(err){
        res.status(400).json({message:err.message});
    }
};

//example of document
// {
//   "_id": "65111a9c84b39cba12345678",
//   "studentId": "650fe6b73d6e4b29df3c98a1",
//   "answers": [
//     {
//       "questionId": "650fe6b73d6e4b29df3c98a9",
//       "answer": "B",
//       "timeSpent": 45
//     }
//   ],
//   "startedAt": "2025-09-19T15:30:00Z",
//   "submittedAt": null
// }

export const saveAnswer = async(req, res)=>{
    try{
        const {attemptId,questionId, answer,timeSpent}= req.body;

        const attempt = await Response.findById(attemptId);
        if(!attempt) return res.status(404).json({message:"attempt not found"});

        const exist = attempt.answers.find(
            (a)=>a.questionId.toString()===questionId
        );

        if(exist){
            exist.selectedOption = answer;
        }else{
            attempt.answers.push({ questionId, selectedOption: answer, timeSpent});
        }

        await attempt.save();
        res.json({message:"answer saved successfully"});
    }catch(err){
        res.status(400).json({message:err.message});
    }
};

export const submitExam = async (req, res)=>{
    try{
        const {attemptId }=req.params;

        const attempt = await Response.findById(attemptId);
        if(!attempt){
            return res.status(404).json({message:"attempt not found"});
        }

        attempt.submittedAt=Date.now();
        await attempt.save();
        res.json({message:"exam submitted successfully "})
    }catch(err){
        res.status(400).json({message:err.message});
    }
};

export const getResult = async (req, res)=>{
    try{
        const {attemptId}=req.params;
        const attempt = await Response.findById(attemptId).populate("answers.questionId");
        if(!attempt) return res.status(404).json({message:"attempt not found"});

        res.json({attempt});
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

export const getAttemptedStatus = async (req,res)=>{
    try{
        const {attemptId}=req.params;
        const attempt = await Response.findById(attemptId).select('submittedAt');
        if(!attempt){
            return res.status(404).json({message:"attempt not found"});
        }
        res.json({submittedAt: attempt.submittedAt});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}