
export interface IEmailAutomation {
    id: string; // UUID
    user_id: string; // UUID
    generated_resume_id: string | null; // UUID
    target_email: string;
    sender_email: string;
    job_description?: string;
    role?: string;
    company?: string;
    subject_line?: string;
    cover_letter?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'FAILED' | 'SUCCESS';
    error?: string;
    created_at?: Date;
    updated_at?: Date;
}
