
import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { applicationRepository } from '../repositories/applicationRepository.js';
import { sendMessageToQueue } from '../services/sqsService.js';
import { encrypt } from '../utils/crypto.js';
import dotenv from 'dotenv';

dotenv.config();

export class ApplicationController extends BaseController {

    /**
     * API Handler: Enqueues the job to SQS
     */
    public async processApplication(req: Request, res: Response): Promise<any> {
        try {
            const {
                role,
                jobDescription,
                targetEmail,
                senderEmail = process.env.PROD_SMTP_EMAIL,
                appPassword = process.env.PROD_SMTP_PASSWORD
            } = req.body;

            if (!role || !jobDescription || !targetEmail || !senderEmail || !appPassword) {
                return this.clientError(res, 'Required fields: role, jobDescription, targetEmail (Recruiter), senderEmail (You), appPassword.');
            }

            // Check for duplicate application (Same Recruiter Email + Same Role) within 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const existingApp = await applicationRepository.findDuplicate(targetEmail, role, sevenDaysAgo);

            if (existingApp) {
                return res.status(429).json({
                    success: false,
                    error: 'Cooldown active',
                    message: `You already applied for the '${role}' role to '${targetEmail}' within the last 7 days. Please wait before reapplying.`
                });
            }

            // Save to DB via Repository
            const savedApp = await applicationRepository.create({
                role,
                jobDescription,
                email: targetEmail,
                status: 'PENDING',
            });

            // Encrypt Password
            const encryptedPassword = encrypt(appPassword);

            // Send to SQS
            await sendMessageToQueue({
                applicationID: savedApp.applicationID,
                encryptedPassword: encryptedPassword,
                senderEmail: senderEmail
            });

            return res.status(202).json({
                success: true,
                message: 'Application queued securely via SQS.',
                jobId: savedApp.applicationID,
                status: 'PENDING'
            });

        } catch (error: any) {
            console.error('Error queueing application:', error);
            return this.fail(res, error.message || 'Internal Server Error');
        }
    }

    /**
     * Retry failed applications
     */
    public async retryFailedApplications(req: Request, res: Response): Promise<any> {
        try {
            const { senderEmail, appPassword } = req.body;

            if (!senderEmail || !appPassword) {
                return this.clientError(res, 'senderEmail and appPassword are required to retry jobs.');
            }

            // 1. Fetch failed tasks via Repository
            const failedApps = await applicationRepository.findFailedApplications();

            if (failedApps.length === 0) {
                return this.ok(res, { success: true, message: 'No failed applications found to retry.' });
            }

            console.log(`Found ${failedApps.length} failed applications. Retrying...`);

            // Encrypt password once (same password for all retries in this batch)
            const encryptedPassword = encrypt(appPassword);
            let retriedCount = 0;

            // 2 & 3. Push to Queue & Update Status via Repository
            for (const app of failedApps) {
                await sendMessageToQueue({
                    applicationID: app.applicationID,
                    encryptedPassword: encryptedPassword,
                    senderEmail: senderEmail
                });

                await applicationRepository.update(app.applicationID, {
                    status: 'PENDING',
                    error: null
                });
                retriedCount++;
            }

            return this.ok(res, {
                success: true,
                message: `Successfully queued ${retriedCount} failed applications for retry.`
            });

        } catch (error: any) {
            console.error('Error retrying applications:', error);
            return this.fail(res, error.message);
        }
    }
}
