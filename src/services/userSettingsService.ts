
import { UserSettingsRepository } from '../repositories/userSettingsRepository.js';
import { IUserSettings } from '../models/UserSettings.js';

export class UserSettingsService {
    private repository: UserSettingsRepository;

    constructor() {
        this.repository = new UserSettingsRepository();
    }

    async getSettings(userId: string): Promise<IUserSettings | null> {
        return this.repository.getByUserId(userId);
    }

    async updateSettings(userId: string, settings: Partial<IUserSettings>): Promise<IUserSettings | null> {
        return this.repository.update(userId, settings, 'user_id');
    }

    async createSettings(settings: Partial<IUserSettings>): Promise<IUserSettings> {
        return this.repository.create(settings);
    }
}
