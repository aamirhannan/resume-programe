import express, { Router } from 'express';
import resumeRoutes from './resumeRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router: Router = express.Router();

router.use('/resume', resumeRoutes); // Prefixing resume routes if desired, or keep flat if that was the intention. 
// The original index.ts mounted resumeRoutes at /api. 
// If I mount it here, I should likely give it a path or just use it.
// Given the user instructions "iprot tha and resumeRoute.ts into index", I'll combine them.

// To maintain backward compatibility with strictly /api/process-application (as seen in resumeRoutes),
// I need to be careful. In src/index.ts: app.use('/api', resumeRoutes);
// So /api/process-application works.
// If I change src/index.ts to use this index router, and I mount resumeRoutes here,
// I should probably mount them at root relative to this router if I want to keep paths same, 
// OR simpler:
// router.use('/', resumeRoutes); // keeps /api/process-application
// router.use('/dashboard', dashboardRoutes); // becomes /api/dashboard/...

router.use('/', resumeRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
