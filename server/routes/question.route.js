import express from "express";

import { addQuestion,getQuestions, updateQuestion, deleteQuestion} from "../controllers/question.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { adminOnly } from "../middlewares/isAuthenticated.js";

const router = express.Router();

//for admin

router.post("/add",isAuthenticated,adminOnly, addQuestion);
router.put("/:questionId", isAuthenticated, adminOnly, updateQuestion);
router.delete("/:questionId", isAuthenticated, adminOnly, deleteQuestion);

//for student
router.get("/",isAuthenticated, getQuestions);

export default router;