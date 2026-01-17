
import { BaseRepository } from './BaseRepository.js';
import { IGeneratedResume } from '../models/GeneratedResume.js';

export class GeneratedResumesRepository extends BaseRepository<IGeneratedResume> {
    protected tableName = 'generated_resumes';
}
