
import { getAuthenticatedClient } from '../utils/supabaseClientHelper.js';
import * as dbController from '../DatabaseController/userSettingsDatabaseController.js';

export const getUserSettings = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const data = await dbController.fetchUserSettings(supabase);
        res.status(200).json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createUserSettings = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const data = await dbController.upsertUserSettings(supabase, req.body, req.user.id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
