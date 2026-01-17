
import { BaseRepository } from './BaseRepository.js';
import { IUserSettings } from '../models/UserSettings.js';

export class UserSettingsRepository extends BaseRepository<IUserSettings> {
    protected tableName = 'user_settings';

    async getByUserId(userId: string): Promise<IUserSettings | null> {
        return this.findById(userId, 'user_id');
    }
}
