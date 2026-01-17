
import express, { Router } from 'express';
import { ResumeController } from '../controllers/resumeController.js';
import { ApplicationController } from '../controllers/applicationController.js';

const router: Router = express.Router();
const resumeController = new ResumeController();
const applicationController = new ApplicationController();

// router.post('/generate', (req, res) => resumeController.generateResume(req, res));
// router.post('/generate-pdf', (req, res) => resumeController.generateResumePDF(req, res));

router.post('/process-application', (req, res) => applicationController.processApplication(req, res));
router.post('/retry-failed', (req, res) => applicationController.retryFailedApplications(req, res));

// generate resume
router.post('/generate-resume-content', (req, res) => resumeController.generateResume(req, res));
router.post('/generate-resume-pdf', (req, res) => resumeController.generateResumePDF(req, res));

// founders outreach
// apify integration
router.post('/founders-outreach-with-linkedin', (_req, _res) => { });
router.post('/founders-outreach-with-email', (_req, _res) => { });

export default router;
