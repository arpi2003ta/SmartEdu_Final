import express from "express";
import { aiSearchCourses, getSearchSuggestions, getSearchAnalytics } from "../controllers/search.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// AI-powered course search (public endpoint)
router.get("/courses", aiSearchCourses);

// Auto-complete search suggestions (public endpoint)
router.get("/suggestions", getSearchSuggestions);

// Search analytics (authenticated endpoint)
router.get("/analytics", isAuthenticated, getSearchAnalytics);

export default router;
