import express from 'express';
import { calculateAndSaveResult } from '../controllers/result.controller.js';
import  isAuthenticated  from '../middlewares/isAuthenticated.js';

const router = express.Router();

//url me sbki unique id ayegi
router.post("/calculate/:attemptId", isAuthenticated, calculateAndSaveResult);

export default router;