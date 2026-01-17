
export interface IMasterResume {
    id: string; // UUID
    user_id: string; // UUID
    role: string;
    content: any; // JSONB
    created_at?: Date;
    updated_at?: Date;
}
