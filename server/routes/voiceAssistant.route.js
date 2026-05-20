import express from "express";
import {
  getVoiceAssistantHistory,
  processPublicVoiceAssistantQuery,
  processVoiceAssistantQuery,
} from "../controllers/voiceAssistant.controller.js";

const router = express.Router();

router.post("/query", processVoiceAssistantQuery);
router.post("/query-public", processPublicVoiceAssistantQuery);
router.get("/history/:userId", getVoiceAssistantHistory);

export default router;
