
import { GeneratedResumesRepository } from '../repositories/generatedResumesRepository.js';
import { IGeneratedResume } from '../models/GeneratedResume.js';

export class GeneratedResumesService {
    private repository: GeneratedResumesRepository;

    constructor() {
        this.repository = new GeneratedResumesRepository();
    }

    async createGeneratedResume(data: Partial<IGeneratedResume>): Promise<IGeneratedResume> {
        return this.repository.create(data);
    }

    async getGeneratedResume(id: string): Promise<IGeneratedResume | null> {
        return this.repository.findById(id);
    }

    async getUserGeneratedResumes(userId: string): Promise<IGeneratedResume[]> {
        return this.repository.find({ user_id: userId });
    }
}
