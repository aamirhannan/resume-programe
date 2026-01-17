
import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { EmailAutomationsService } from '../services/emailAutomationsService.js';

export class EmailAutomationsController extends BaseController {
    private service: EmailAutomationsService;

    constructor() {
        super();
        this.service = new EmailAutomationsService();
    }

    public async create(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.auth?.userId;
            if (!userId) return this.clientError(res, 'User ID required');
            
            const data = { ...req.body, user_id: userId };
            const created = await this.service.createAutomation(data);
            return this.created(res, created);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public async list(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.auth?.userId;
            if (!userId) return this.clientError(res, 'User ID required');
            const list = await this.service.getUserAutomations(userId);
            return this.ok(res, list);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }
}
