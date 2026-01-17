
import { getAuthenticatedClient } from '../utils/supabaseClientHelper.js';
import * as dbController from '../DatabaseController/emailAutomationDatabaseController.js';

export const getEmailAutomation = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const data = await dbController.fetchEmailAutomations(supabase);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createEmailAutomation = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const data = await dbController.insertEmailAutomation(supabase, req.body, req.user.id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
