
import { BaseRepository } from './BaseRepository.js';
import { IMasterResume } from '../models/MasterResume.js';
import { supabase } from '../config/supabase.js';

export class MasterResumesRepository extends BaseRepository<IMasterResume> {
    protected tableName = 'master_resumes';

    async findByRole(userId: string, role: string): Promise<IMasterResume | null> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('user_id', userId)
            .eq('role', role)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            this.handleError(error, 'findByRole');
        }
        return data as IMasterResume;
    }
}
