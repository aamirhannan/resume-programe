
import { MasterResumesRepository } from '../repositories/masterResumesRepository.js';
import { IMasterResume } from '../models/MasterResume.js';

export class MasterResumesService {
    private repository: MasterResumesRepository;

    constructor() {
        this.repository = new MasterResumesRepository();
    }

    async getResumeByRole(userId: string, role: string): Promise<IMasterResume | null> {
        return this.repository.findByRole(userId, role);
    }

    async createOrUpdateResume(userId: string, role: string, content: any): Promise<IMasterResume> {
        const existing = await this.repository.findByRole(userId, role);
        if (existing) {
            return (await this.repository.update(existing.id, { content, updated_at: new Date() }))!;
        } else {
            return await this.repository.create({ user_id: userId, role, content });
        }
    }

    async getAllResumes(userId: string): Promise<IMasterResume[]> {
        return this.repository.find({ user_id: userId });
    }
}
