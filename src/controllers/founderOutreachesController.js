
import { getAuthenticatedClient } from '../utils/supabaseClientHelper.js';
import * as dbController from '../DatabaseController/founderOutreachesDatabaseController.js';

export const getFounderOutreaches = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const data = await dbController.fetchFounderOutreaches(supabase);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createFounderOutreach = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const data = await dbController.insertFounderOutreach(supabase, req.body, req.user.id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
