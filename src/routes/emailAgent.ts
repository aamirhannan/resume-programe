import express, { Router } from 'express';

import { 
    processEmail,
    retryFailedApplications
} from '#src/controllers/emailAgentController';


const router: Router = express.Router();

router.post('/process-application', processEmail);
router.post('/retry-failed-applications', retryFailedApplications);

export default router;