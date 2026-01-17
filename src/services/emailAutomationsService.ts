
import { EmailAutomationsRepository } from '../repositories/emailAutomationsRepository.js';
import { IEmailAutomation } from '../models/EmailAutomation.js';

export class EmailAutomationsService {
    private repository: EmailAutomationsRepository;

    constructor() {
        this.repository = new EmailAutomationsRepository();
    }

    async createAutomation(data: Partial<IEmailAutomation>): Promise<IEmailAutomation> {
        return this.repository.create(data);
    }

    async getUserAutomations(userId: string): Promise<IEmailAutomation[]> {
        return this.repository.find({ user_id: userId });
    }

    async getAutomation(id: string): Promise<IEmailAutomation | null> {
        return this.repository.findById(id);
    }
}
