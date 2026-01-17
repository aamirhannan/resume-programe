
import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { UserSettingsService } from '../services/userSettingsService.js';

export class UserSettingsController extends BaseController {
    private service: UserSettingsService;

    constructor() {
        super();
        this.service = new UserSettingsService();
    }

    public async getSettings(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.auth?.userId;
            if (!userId) return this.clientError(res, 'User ID required');

            const settings = await this.service.getSettings(userId);
            if (!settings) return this.notFound(res, 'Settings not found');

            return this.ok(res, settings);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public async updateSettings(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.auth?.userId;
            const changes = req.body.settings;
            if (!userId) return this.clientError(res, 'User ID required');

            const updated = await this.service.updateSettings(userId, changes);
            return this.ok(res, updated);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }
}
