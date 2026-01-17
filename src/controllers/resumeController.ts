
import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { getResumeByRole } from '../services/resumeLoader.js';
import { Pipeline } from '../pipeline/Pipeline.js';
import { RewriteResumeViaLLM } from '../pipeline/steps/recrute-outreach-via-email/RewriteResumeViaLLM.js';
import { CriticalAnalysis } from '../pipeline/steps/recrute-outreach-via-email/CriticalAnalysis.js';
import { EvidenceBasedRefinement } from '../pipeline/steps/recrute-outreach-via-email/EvidenceBasedRefinement.js';
import { InsertNewlyCreatedResumePoints } from '../pipeline/steps/recrute-outreach-via-email/InsertNewlyCreatedResumePoints.js';
import { createPDF } from '../services/pdfGenerator.js';

export class ResumeController extends BaseController {

    public async generateResume(req: Request, res: Response): Promise<any> {
        try {
            const { role, jobDescription } = req.body;

            if (!role) {
                return this.clientError(res, 'Role is required (frontend, backend, fullstack)');
            }

            const baseResume = getResumeByRole(role);

            // Execute Pipeline
            const pipeline = new Pipeline()
                .addStep(new RewriteResumeViaLLM());

            const result: any = await pipeline.execute({
                resume: baseResume,
                jobDescription,
                tokenUsage: { input: 0, output: 0, total: 0, cost: 0 }
            });

            return this.ok(res, {
                success: true,
                data: result.rewrittenResume,
                meta: result.meta,
                analysis: result.cvWolfAnalysis,
                tokenUsage: result.tokenUsage
            });
        } catch (error: any) {
            console.error('Error serving resume request:', error);
            return this.fail(res, error.message || 'Internal Server Error');
        }
    }

    public async generateResumePDF(req: Request, res: Response): Promise<any> {
        try {
            const { role, jobDescription } = req.body;

            if (!role) {
                return this.clientError(res, 'Role is required');
            }

            const baseResume = getResumeByRole(role);

            // Execute Pipeline to get optimized data
            const pipeline = new Pipeline()
                .addStep(new RewriteResumeViaLLM())
                .addStep(new CriticalAnalysis())
                .addStep(new EvidenceBasedRefinement())
                .addStep(new InsertNewlyCreatedResumePoints());

            const result: any = await pipeline.execute({
                resume: baseResume,
                jobDescription,
                tokenUsage: { input: 0, output: 0, total: 0, cost: 0 }
            });

            // Generate PDF
            const evidenceBasedResume = await createPDF(result.evidenceBasedRefinementResult);

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Length': evidenceBasedResume.length.toString(),
                'Content-Disposition': `attachment; filename="Resumes_${role || 'Optimized'}.pdf"`,
                'X-Token-Usage-Cost': result.tokenUsage?.cost?.toFixed(4) || '0',
                'X-Token-Input': result.tokenUsage?.input || '0',
                'X-Token-Output': result.tokenUsage?.output || '0'
            });

            return res.send(evidenceBasedResume);

        } catch (error: any) {
            console.error('Error generating PDF:', error);
            return this.fail(res, error.message);
        }
    }
}
