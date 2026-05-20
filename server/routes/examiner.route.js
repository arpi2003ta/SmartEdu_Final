// import express from "express";

// import { addanswers,getAnswers,deleteAnswer,updateAnswer} from "../controllers/examiner.controller.js";
// import isAuthenticated, { adminOnly } from "../middlewares/isAuthenticated.js";

// const router = express.Router();

// router.post("/add",isAuthenticated,adminOnly,addanswers);
// router.get("/",isAuthenticated,adminOnly,getAnswers);
// router.delete("/:id",isAuthenticated,adminOnly,deleteAnswer);
// router.post("/:id",isAuthenticated,adminOnly,updateAnswer);

// export default router;

import express from "express";

import {
  getExam,
  submitOmr,
  uploadExam,
  evaluateOmr,
  getExamResult,
  getDetectedAnswers,
} from "../controllers/examiner.controller.js";
import isAuthenticated, { adminOnly } from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";
import singleUpload from "../middlewares/multer.middleware.js";

const router = express.Router();

const multipleUpload = upload.fields([
  { name: "questions", maxCount: 1 },
  { name: "answerKey", maxCount: 1 },
  { name: "omr", maxCount: 1 },
]);

router
  .route("/exam/upload")
  .post(isAuthenticated, adminOnly, multipleUpload, uploadExam);
router.route("/exam/getExam").get(isAuthenticated, getExam);
router
  .route("/exam/submitOmr")
  .post(isAuthenticated, singleUpload, submitOmr);
router.route("/exam/evaluate/:submissionId").post(isAuthenticated, evaluateOmr);
router.route("/exam/result/:submissionId").get(isAuthenticated, getExamResult);
router
  .route("/exam/detected/:submissionId")
  .get(isAuthenticated, getDetectedAnswers);

  
export default router;
