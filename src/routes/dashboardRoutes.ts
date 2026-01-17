import express, { Router } from 'express';
import { 
    getMetrics, 
    getRoleDistributionChart, 
    getDailyVelocityChart, 
    getHeatmapData, 
    getRecentActivity 
} from '#src/controllers/dashboardController';

const router: Router = express.Router();
router.get('/metrics', getMetrics);
router.get('/charts/role-distribution', getRoleDistributionChart);
router.get('/charts/daily-velocity', getDailyVelocityChart);
router.get('/charts/heatmap', getHeatmapData);
router.get('/recent-activity', getRecentActivity);

export default router;
