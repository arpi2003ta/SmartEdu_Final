import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    createRoadmap,
    getActiveRoadmap,
    getRoadmapHistory,
    updateProgress,
    deleteRoadmap
} from "../controllers/roadmap.controller.js";

const router = express.Router();

// Create new roadmap
router.route("/").post(isAuthenticated, createRoadmap);

// Get active roadmap
router.route("/active").get(isAuthenticated, getActiveRoadmap);

// Get all roadmaps (history)
router.route("/history").get(isAuthenticated, getRoadmapHistory);

// Update progress
router.route("/:roadmapId/progress").post(isAuthenticated, updateProgress);

// Delete roadmap
router.route("/:roadmapId").delete(isAuthenticated, deleteRoadmap);

export default router;