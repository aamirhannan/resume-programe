
import { BaseRepository } from './BaseRepository.js';
import { IResumeGeneration } from '../models/ResumeGeneration.js';

export class ResumeGenerationsRepository extends BaseRepository<IResumeGeneration> {
    protected tableName = 'resume_generations';
}
