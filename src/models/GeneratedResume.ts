
export interface IGeneratedResume {
    id: string; // UUID
    user_id: string; // UUID
    master_resume_id: string | null; // UUID
    file_path: string | null;
    content: any | null; // JSONB
    created_at?: Date;
    updated_at?: Date;
}
