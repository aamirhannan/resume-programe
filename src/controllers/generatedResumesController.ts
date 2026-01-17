
import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { GeneratedResumesService } from '../services/generatedResumesService.js';

export class GeneratedResumesController extends BaseController {
    private service: GeneratedResumesService;

    constructor() {
        super();
        this.service = new GeneratedResumesService();
    }

    public async list(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.auth?.userId;
            if (!userId) return this.clientError(res, 'User ID required (Auth failed)');
            const list = await this.service.getUserGeneratedResumes(userId);
            return this.ok(res, list);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const item = await this.service.getGeneratedResume(id as string);
            if (!item) return this.notFound(res);
            return this.ok(res, item);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }
}
