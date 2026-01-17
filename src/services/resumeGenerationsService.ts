
import { ResumeGenerationsRepository } from '../repositories/resumeGenerationsRepository.js';
import { IResumeGeneration } from '../models/ResumeGeneration.js';

export class ResumeGenerationsService {
    private repository: ResumeGenerationsRepository;

    constructor() {
        this.repository = new ResumeGenerationsRepository();
    }

    async logGeneration(data: Partial<IResumeGeneration>): Promise<IResumeGeneration> {
        return this.repository.create(data);
    }

    async getUserGenerations(userId: string): Promise<IResumeGeneration[]> {
        return this.repository.find({ user_id: userId });
    }
}
