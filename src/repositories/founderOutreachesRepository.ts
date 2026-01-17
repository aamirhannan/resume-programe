
import { BaseRepository } from './BaseRepository.js';
import { IFounderOutreach } from '../models/FounderOutreach.js';

export class FounderOutreachesRepository extends BaseRepository<IFounderOutreach> {
    protected tableName = 'founder_outreaches';
}
