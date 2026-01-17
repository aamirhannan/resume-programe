
import { getAuthenticatedClient } from '../utils/supabaseClientHelper.js';

export const getFounderOutreaches = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const { data, error } = await supabase
            .from('founder_outreaches')
            .select('*');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createFounderOutreach = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const { data, error } = await supabase
            .from('founder_outreaches')
            .insert({ ...req.body, user_id: req.user.id })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
