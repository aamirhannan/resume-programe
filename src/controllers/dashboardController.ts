import { Request, Response } from 'express';
import { SupabaseDashboardRepository } from '#src/repositories/dashboardRepository';

const dashboardRepo = new SupabaseDashboardRepository();

export const getMetrics = async (req: Request, res: Response) => {
    try {
        const client = req.supabase;
        if (!client) return res.status(401).json({ error: 'Unauthorized: No DB context' });

        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;
        
        const data = await dashboardRepo.getMetrics(client, start, end);
        res.json(data);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getRoleDistributionChart = async (req: Request, res: Response) => {
    try {
        const client = req.supabase;
        if (!client) return res.status(401).json({ error: 'Unauthorized: No DB context' });

        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;

        const data = await dashboardRepo.getRoleDistribution(client, start, end);
        res.json(data);
    } catch (error) {
        console.error('Error fetching role distribution:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getDailyVelocityChart = async (req: Request, res: Response) => {
    try {
        const client = req.supabase;
        if (!client) return res.status(401).json({ error: 'Unauthorized: No DB context' });

        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;

        const data = await dashboardRepo.getDailyVelocity(client, start, end);
        res.json(data);
    } catch (error) {
        console.error('Error fetching daily velocity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getHeatmapData = async (req: Request, res: Response) => {
    try {
        const client = req.supabase;
        if (!client) return res.status(401).json({ error: 'Unauthorized: No DB context' });

        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;

        const data = await dashboardRepo.getActivityHeatmap(client, start, end);
        res.json(data);
    } catch (error) {
        console.error('Error fetching heatmap:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const client = req.supabase;
        if (!client) return res.status(401).json({ error: 'Unauthorized: No DB context' });

        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
        const data = await dashboardRepo.getRecentActivity(client, limit);
        res.json(data);
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
