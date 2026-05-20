import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import { startExam, submitExam,saveAnswer, getResult, getAttemptedStatus } from "../controllers/response.controller.js";

const router = express.Router();

router.post("/start",isAuthenticated,startExam);
router.post("/save",isAuthenticated,saveAnswer);
router.post("/submit/:attemptId", isAuthenticated, submitExam);
router.get("/result/:attemptId",isAuthenticated,getResult);
router.get("/status/:attemptId", isAuthenticated, getAttemptedStatus);

export default router;