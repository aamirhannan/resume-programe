
import { BaseRepository } from './BaseRepository.js';
import { IEmailAutomation } from '../models/EmailAutomation.js';

export class EmailAutomationsRepository extends BaseRepository<IEmailAutomation> {
    protected tableName = 'email_automations';
}
