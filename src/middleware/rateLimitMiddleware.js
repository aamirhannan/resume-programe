
import { getAuthenticatedClient } from '../utils/supabaseClientHelper.js';
import * as dbController from '../DatabaseController/emailAutomationDatabaseController.js';

export const rateLimitMiddleware = async (req, res, next) => {
    try {
        const { planTier, id: userId } = req.user;
        const supabase = getAuthenticatedClient(req.accessToken);

        let limit = 5; // Default TRIAL
        let startTime = new Date();

        // 1. Determine Limits based on Plan
        if (planTier === 'TRIAL_TIER') {
            limit = 5;
            // Rolling 30 Days window
            startTime.setDate(startTime.getDate() - 30);
        } else if (planTier === 'PRO_TIER') {
            limit = 10;
            // Rigid Day Window: Resets at 00:00 UTC today
            startTime.setUTCHours(0, 0, 0, 0);
        } else if (planTier === 'PREMIUM_TIER') {
            limit = 25;
            // Rigid Day Window: Resets at 00:00 UTC today
            startTime.setUTCHours(0, 0, 0, 0);
        } else {
            // Fallback for unknown plans
            limit = 5;
            startTime.setDate(startTime.getDate() - 30);
        }

        // 2. Count Usage
        const count = await dbController.countEmailsInTimeFrame(supabase, userId, startTime);

        // 3. Enforce Limit
        if (count >= limit) {
            return res.status(429).json({
                error: `Rate limit reached. You are on the ${planTier} plan which allows ${limit} emails per period. You have already sent ${count}.`,
                currentUsage: count,
                limit: limit,
                plan: planTier,
                resetTime: planTier === 'TRIAL_TIER' ? 'Rolling 30 Days' : '00:00 UTC Tomorrow'
            });
        }

        next();

    } catch (error) {
        console.error('Rate Limit Middleware Error:', error);
        return res.status(500).json({ error: 'Internal Server Error during rate limiting check' });
    }
};
