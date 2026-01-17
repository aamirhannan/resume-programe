
import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { ResumeGenerationsService } from '../services/resumeGenerationsService.js';

export class ResumeGenerationsController extends BaseController {
    private service: ResumeGenerationsService;

    constructor() {
        super();
        this.service = new ResumeGenerationsService();
    }

    public async list(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.auth?.userId;
            if (!userId) return this.clientError(res, 'User ID required');

            const list = await this.service.getUserGenerations(userId);
            return this.ok(res, list);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }
}
