
import { getAuthenticatedClient } from '../utils/supabaseClientHelper.js';
import * as dbController from '../DatabaseController/generatedResumeDatabaseController.js';

export const getGeneratedResume = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const data = await dbController.fetchGeneratedResumes(supabase);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createGeneratedResume = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const data = await dbController.insertGeneratedResume(supabase, req.body, req.user.id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
