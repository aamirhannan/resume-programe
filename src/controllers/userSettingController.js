
import { getAuthenticatedClient } from '../utils/supabaseClientHelper.js';

export const getUserSettings = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found, which is fine, return null or empty

        res.status(200).json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createUserSettings = async (req, res) => {
    try {
        const supabase = getAuthenticatedClient(req.accessToken);
        // Uses upsert typically for settings
        const { data, error } = await supabase
            .from('user_settings')
            .upsert({ ...req.body, user_id: req.user.id }) // user_id is implicit in RLS but good to be explicit for insert
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
