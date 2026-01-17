
import { FounderOutreachesRepository } from '../repositories/founderOutreachesRepository.js';
import { IFounderOutreach } from '../models/FounderOutreach.js';

export class FounderOutreachesService {
    private repository: FounderOutreachesRepository;

    constructor() {
        this.repository = new FounderOutreachesRepository();
    }

    async createOutreach(data: Partial<IFounderOutreach>): Promise<IFounderOutreach> {
        return this.repository.create(data);
    }

    async getUserOutreaches(userId: string): Promise<IFounderOutreach[]> {
        return this.repository.find({ user_id: userId });
    }
}
