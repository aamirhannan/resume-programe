
export interface IResumeGeneration {
    id: string; // UUID
    user_id: string; // UUID
    generated_resume_id: string | null; // UUID
    role?: string;
    prev_resume_content?: any; // JSONB
    new_resume_content?: any; // JSONB
    status: 'PENDING' | 'IN_PROGRESS' | 'FAILED' | 'SUCCESS';
    error?: string;
    created_at?: Date;
    updated_at?: Date;
}
