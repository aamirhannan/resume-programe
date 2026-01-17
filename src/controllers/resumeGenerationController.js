
import { getAuthenticatedClient } from '../utils/supabaseClientHelper.js';

export const getResumeGeneration = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const { data, error } = await supabase
            .from('resume_generations')
            .select('*');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createResumeGeneration = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const { data, error } = await supabase
            .from('resume_generations')
            .insert({ ...req.body, user_id: req.user.id })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
