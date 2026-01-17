
import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { FounderOutreachesService } from '../services/founderOutreachesService.js';

export class FounderOutreachesController extends BaseController {
    private service: FounderOutreachesService;

    constructor() {
        super();
        this.service = new FounderOutreachesService();
    }

    public async create(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.auth?.userId;
            if (!userId) return this.clientError(res, 'User ID required');

            const data = { ...req.body, user_id: userId };
            const created = await this.service.createOutreach(data);
            return this.created(res, created);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public async list(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.auth?.userId;
            if (!userId) return this.clientError(res, 'User ID required');
            
            const list = await this.service.getUserOutreaches(userId);
            return this.ok(res, list);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }
}
