import express from "express";
import { getCollegePrediction } from "../controllers/predictor.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// @route   POST /api/v1/predict
// @desc    Get college prediction
// @access  Private (user must be logged in)
router.post("/", getCollegePrediction);

export default router;