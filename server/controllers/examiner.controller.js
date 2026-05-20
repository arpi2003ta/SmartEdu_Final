import { Exam, ExamSubmission } from "../models/AIExaminer.model.js";
import { uploadMedia, deleteMediaFromCloudinary } from "../utils/cloudinary.js";
import { evaluateNeetOMR } from "../utils/neetOmrEvaluator.js";
import axios from "axios";
import { execFile } from "node:child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const uploadExam = async (req, res) => {
  try {
    const instructorId = req.id;
    const { name } = req.body;
    const existingExam = await Exam.findOne();

    let newExamData = {};
    let oldPublicIds = [];

    if (name) {
      newExamData.name = name;
    }

    if (req.files && req.files.questions) {
      const questionFile = req.files.questions[0];
      const questionResponse = await uploadMedia(questionFile.path);
      if (!questionResponse) {
        return res
          .status(400)
          .json({ message: "Error on uploading question file" });
      }
      newExamData.questionPaper = {
        url: questionResponse.secure_url,
        publicId: questionResponse.public_id,
      };
      if (existingExam && existingExam.questionPaper) {
        oldPublicIds.push(existingExam.questionPaper.publicId);
      }
    }

    if (req.files && req.files.answerKey) {
      const answerKeyFile = req.files.answerKey[0];
      const answerKeyResponse = await uploadMedia(answerKeyFile.path);
      if (!answerKeyResponse) {
        return res
          .status(400)
          .json({ message: "Error on uploading answerkey file" });
      }
      newExamData.answerKey = {
        url: answerKeyResponse.secure_url,
        publicId: answerKeyResponse.public_id,
      };
      if (existingExam && existingExam.answerKey) {
        oldPublicIds.push(existingExam.answerKey.publicId);
      }
    }

    if (req.files && req.files.omr) {
      const omrFile = req.files.omr[0];
      const omrResponse = await uploadMedia(omrFile.path);
      if (!omrResponse) {
        return res.status(400).json({ message: "Error on uploading omr file" });
      }
      newExamData.omrSheet = {
        url: omrResponse.secure_url,
        publicId: omrResponse.public_id,
      };
      if (existingExam && existingExam.omrSheet) {
        oldPublicIds.push(existingExam.omrSheet.publicId);
      }
    }

    if (existingExam) {
      existingExam.set(newExamData);
      const updatedExam = await existingExam.save();

      if (oldPublicIds.length > 0) {
        await Promise.all(
          oldPublicIds
            .filter((id) => id)
            .map((id) => deleteMediaFromCloudinary(id)),
        );
      }

      return res.status(200).json({
        success: true,
        message: "Exam updated successfully",
        exam: updatedExam,
      });
    } else {
      if (
        !newExamData.name ||
        !newExamData.questionPaper ||
        !newExamData.answerKey ||
        !newExamData.omrSheet
      ) {
        return res.status(400).json({ message: "upload all files" });
      }
      newExamData.instructor = instructorId;
      const newExam = await Exam.create(newExamData);
      return res.status(200).json({
        success: true,
        message: "exam uploaded successfully",
        newExam,
      });
    }
  } catch (err) {
    return res.status(400).json({ message: "Server error on exam upload" });
  }
};

export const getExam = async (req, res) => {
  try {
    const exam = await Exam.findOne().select("-answerKey");
    if (!exam) {
      return res.status(404).json({ message: "no exam has been uploaded yet" });
    }

    const examDetail = {
      _id: exam._id,
      name: exam.name,
      questionPaperUrl: exam.questionPaper.url,
      omrSheetUrl: exam.omrSheet.url,
    };

    return res.status(200).json({
      success: true,
      message: "Exam details",
      examDetail,
    });
  } catch (err) {
    return res.status(400).json({
      message: "error on hiting getExam controller",
      error: err,
    });
  }
};

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getStudentAnswers = async (imageUrl) => {
  const tempFileName = `omr_${crypto.randomUUID()}.jpg`;
  const tempPath = path.join(__dirname, tempFileName);

  try {
    //download image
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(tempPath, response.data);

    const scriptPath = path.join(__dirname, "../../omr/omr_pipeline.py");

    return await new Promise((resolve, reject) => {
      execFile(
        "python",
        [scriptPath, "--mode", "student", "--image", tempPath],
        { maxBuffer: 1024 * 1024 * 10 },
        (err, stdout, stderr) => {
          if (err) {
            console.error("ML stderr:", stderr);
            return reject(err);
          }

          try {
            const cleanOutput = stdout.toString().trim();
            const answers = JSON.parse(cleanOutput);

            if (!Array.isArray(answers)) {
              throw new Error("ML output is not an array");
            }

            resolve(answers);
          } catch (parseErr) {
            console.error("ML output parse error:", stdout);
            reject(parseErr);
          }
        },
      );
    });
  } finally {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
};

const fetchAnswerKey = async (url) => {
  try {
    const res = await axios.get(url);
    const data = res.data;
    if (!Array.isArray(data)) {
      console.warn("Answer key is not an array, returning empty array");
      return [];
    }
    return data;
  } catch (err) {
    console.error("Failed to fetch answer key:", err.message);
    return [];
  }
};


export const submitOmr = async (req, res) => {
  try {
    const studentId = req.id;

    const exam = await Exam.findOne();
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload filled OMR",
      });
    }

    const omrResponse = await uploadMedia(req.file);
    console.log("UPLOAD MEDIA RAW RESPONSE 👉", omrResponse);
    console.log("TYPE 👉", typeof omrResponse);

    console.log("OMR upload response:", omrResponse);
    if (!omrResponse || !omrResponse.secure_url || !omrResponse.public_id) {
      return res.status(400).json({
        success: false,
        message: "Failed to upload OMR",
      });
    }

    const newSubmission = await ExamSubmission.create({
      exam: exam._id,
      student: studentId,
      filledOmr: {
        url: omrResponse.secure_url,
        publicId: omrResponse.public_id,
      },
    });

    let answerKey = [];
    try {
      // ML detects correct answers from answerKey image/PDF
      answerKey = await getStudentAnswers(exam.answerKey.url);
    } catch (err) {
      console.error("Answer key ML failed:", err.message);
    }

    if (!Array.isArray(answerKey) || answerKey.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Answer key is missing or invalid",
      });
    }

    // Map subjects and normalize correctOption
    answerKey = answerKey.map((a) => {
      let subject = "physics"; // default
      if (a.questionNumber >= 51 && a.questionNumber <= 100)
        subject = "chemistry";
      if (a.questionNumber >= 101) subject = "biology";

      return {
        questionNumber: a.questionNumber,
        correctOption: a.correctOption || a.selectedOption, // fallback
        subject,
      };
    });

    // detect student answers
    let detectedAnswers = [];
    try {
      detectedAnswers = await getStudentAnswers(newSubmission.filledOmr.url);
    } catch (mlError) {
      return res.status(500).json({
        success: false,
        message: "OMR detection failed",
      });
    }

    if (!Array.isArray(detectedAnswers)) {
      return res.status(500).json({
        success: false,
        message: "Invalid ML response",
      });
    }

    //  Normalize Answers
    const studentAnswersComplete = answerKey.map((q) => {
      const detected = detectedAnswers.find(
        (a) => a.questionNumber === q.questionNumber,
      );

      return (
        detected || {
          questionNumber: q.questionNumber,
          selectedOption: null,
          confidence: 0,
        }
      );
    });

    newSubmission.detectedMarks = studentAnswersComplete;

    const evaluation = evaluateNeetOMR({
      answerKey,
      studentAnswers: studentAnswersComplete,
    });

    newSubmission.evaluation = evaluation;
    await newSubmission.save();

    // response
    return res.status(200).json({
      success: true,
      message: "Your Filled OMR Submitted Successfully",
      submissionId: newSubmission._id,
      detectedMarks: studentAnswersComplete,
      evaluation,
    });
  } catch (error) {
    console.error("submitOmr full error ->", error);
    return res.status(500).json({
      success: false,
      message: "Error while submitting OMR",
      error: error.message,
    });
  }
};

export const evaluateOmr = async (req, res) => {
  console.log("evaluateOmr controller hit");
  try {
    const { submissionId } = req.params;
    const { answerKey } = req.body;

    if (!submissionId) {
      return res.status(400).json({ message: "submissionId is required" });
    }

    if (!Array.isArray(answerKey)) {
      return res.status(400).json({ message: "answerKey must be an array" });
    }

    const submission = await ExamSubmission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "submission not found" });
    }

    // Calling ML API
    const mlResponse = await axios.post("http://localhost:5001/predict", {
      imageUrl: submission.filledOmr.url,
    });

    console.log("ML Response -> ", mlResponse);
    const studentAnswers = mlResponse.data.answers;
    console.log("ML Raw Response:", mlResponse.data);
    console.log("Student Answers:", studentAnswers);
    console.log("Student Answers Length:", studentAnswers?.length);

    if (!Array.isArray(studentAnswers)) {
      return res.status(500).json({ message: "ML detection failed" });
    }

    const evaluation = evaluateNeetOMR({
      answerKey,
      studentAnswers,
    });

    submission.detectedMarks = studentAnswers;
    submission.evaluation = evaluation;
    await submission.save();

    return res.status(200).json({
      success: true,
      message: "OMR evaluated successfully",
      detectedMarks: studentAnswers,
      evaluation,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error on evaluating OMR",
      error,
    });
  }
};

export const getExamResult = async (req, res) => {
  try {
    const { submissionId } = req.params;

    if (!submissionId) {
      return res.status(400).json({ message: "submissionId is required" });
    }

    const submission = await ExamSubmission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "submission not found" });
    }

    if (!submission.evaluation) {
      return res
        .status(400)
        .json({ message: "evaluation not available for this submission yet" });
    }

    return res.status(200).json({
      success: true,
      message: "Exam evaluation fetched successfully",
      detectedMarks: submission.detectedMarks || [],
      evaluation: submission.evaluation,
    });
  } catch (err) {
    return res.status(500).json({
      message: "error on fetching exam evaluation",
      error: err,
    });
  }
};

export const getDetectedAnswers = async (req, res) => {
  try {
    const { submissionId } = req.params;

    if (!submissionId) {
      return res.status(400).json({ message: "submissionId is required" });
    }

    const submission =
      await ExamSubmission.findById(submissionId).select("detectedMarks");

    if (!submission) {
      return res.status(404).json({ message: "submission not found" });
    }

    return res.status(200).json({
      success: true,
      detectedAnswers: submission.detectedMarks || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "error on fetching detected answers",
      error: error.toString(),
    });
  }
};
