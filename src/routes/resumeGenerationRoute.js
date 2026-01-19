import express from 'express';
import { getResumeGeneration, createResumeGeneration } from '../controllers/resumeGenerationController.js';

const router = express.Router();

router.get('/get-resume', getResumeGeneration);
router.post('/create-resume', createResumeGeneration);

export default router;
