
import { getAuthenticatedClient } from '../utils/supabaseClientHelper.js';
import * as dbController from '../DatabaseController/dashboardDatabaseController.js';

export const getDashboardMetrics = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const metrics = await dbController.fetchDashboardMetrics(supabase);
        res.status(200).json(metrics);
    } catch (error) {
        console.error('getDashboardMetrics error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getDashboardRoleDistribution = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const distribution = await dbController.fetchDashboardRoleDistribution(supabase);
        res.status(200).json(distribution);
    } catch (error) {
        console.error('getDashboardRoleDistribution error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getDashboardDailyVelocity = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const velocity = await dbController.fetchDashboardDailyVelocity(supabase);
        res.status(200).json(velocity);
    } catch (error) {
        console.error('getDashboardDailyVelocity error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getDashboardHeatmap = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const heatmap = await dbController.fetchDashboardHeatmap(supabase);
        res.status(200).json(heatmap);
    } catch (error) {
        console.error('getDashboardHeatmap error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getDashboardRecentActivity = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const activity = await dbController.fetchDashboardRecentActivity(supabase);
        res.status(200).json(activity);
    } catch (error) {
        console.error('getDashboardRecentActivity error:', error);
        res.status(500).json({ error: error.message });
    }
};