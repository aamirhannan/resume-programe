
import express, { Router } from 'express';
import { UserSettingsController } from '../controllers/userSettingsController.js';
import { MasterResumesController } from '../controllers/masterResumesController.js';
import { GeneratedResumesController } from '../controllers/generatedResumesController.js';
import { EmailAutomationsController } from '../controllers/emailAutomationsController.js';
import { FounderOutreachesController } from '../controllers/founderOutreachesController.js';
import { ResumeGenerationsController } from '../controllers/resumeGenerationsController.js';

const router: Router = express.Router();

const userSettingsController = new UserSettingsController();
const masterResumesController = new MasterResumesController();
const generatedResumesController = new GeneratedResumesController();
const emailAutomationsController = new EmailAutomationsController();
const founderOutreachesController = new FounderOutreachesController();
const resumeGenerationsController = new ResumeGenerationsController();

// User Settings
router.get('/settings', (req, res) => userSettingsController.getSettings(req, res));
router.put('/settings', (req, res) => userSettingsController.updateSettings(req, res));

// Master Resumes
router.get('/master-resumes', (req, res) => masterResumesController.listResumes(req, res));
router.post('/master-resumes/save', (req, res) => masterResumesController.saveResume(req, res));
router.get('/master-resumes/:role', (req, res) => masterResumesController.getResume(req, res));

// Generated Resumes
router.get('/generated-resumes', (req, res) => generatedResumesController.list(req, res));
router.get('/generated-resumes/:id', (req, res) => generatedResumesController.getOne(req, res));

// Email Automations
router.get('/email-automations', (req, res) => emailAutomationsController.list(req, res));
router.post('/email-automations', (req, res) => emailAutomationsController.create(req, res));

// Founder Outreaches
router.get('/founder-outreaches', (req, res) => founderOutreachesController.list(req, res));
router.post('/founder-outreaches', (req, res) => founderOutreachesController.create(req, res));

// Resume Generations
router.get('/resume-generations', (req, res) => resumeGenerationsController.list(req, res));

export default router;
