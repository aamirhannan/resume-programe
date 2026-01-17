
import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { MasterResumesService } from '../services/masterResumesService.js';

export class MasterResumesController extends BaseController {
    private service: MasterResumesService;

    constructor() {
        super();
        this.service = new MasterResumesService();
    }

    public async getResume(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.auth?.userId;
            const { role } = req.params; 
            if (!userId || !role) return this.clientError(res, 'User ID and Role required');

            const resume = await this.service.getResumeByRole(userId, role as string);
            if (!resume) return this.notFound(res, 'Resume not found');

            return this.ok(res, resume);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public async saveResume(req: Request, res: Response): Promise<any> {
        try {
             const userId = req.auth?.userId;
             const { role, content } = req.body;
             if (!userId || !role || !content) return this.clientError(res, 'Missing fields');

             const saved = await this.service.createOrUpdateResume(userId, role, content);
             return this.ok(res, saved);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public async listResumes(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.auth?.userId;
            if (!userId) return this.clientError(res, 'User ID required');

            const list = await this.service.getAllResumes(userId);
            return this.ok(res, list);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }
}
