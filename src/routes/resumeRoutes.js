import express from 'express';
import { generateResume, generateResumePDF } from '../controllers/resumeController.js';

const router = express.Router();

router.post('/generate', generateResume);
router.post('/generate-pdf', generateResumePDF);

export default router;
