
export interface IFounderOutreach {
    id: string; // UUID
    user_id: string; // UUID
    generated_resume_id: string | null; // UUID
    linkedin_profile?: string;
    founder_details?: any; // JSONB
    job_description?: string;
    role?: string;
    cover_letter?: string;
    subject_line?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'FAILED' | 'SUCCESS';
    error?: string;
    created_at?: Date;
    updated_at?: Date;
}
