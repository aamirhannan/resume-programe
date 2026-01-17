
export interface IUserSettings {
    user_id: string; // UUID
    workspace_id: string; // UUID
    blocked_emails: string[];
    blocked_domains: string[];
    daily_limit: number;
    created_at?: Date;
    updated_at?: Date;
}
