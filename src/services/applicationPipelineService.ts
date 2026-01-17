
import { getResumeByRole } from '../services/resumeLoader.js';
import { Pipeline } from '../pipeline/Pipeline.js';
import { RewriteResumeViaLLM } from '../pipeline/steps/recrute-outreach-via-email/RewriteResumeViaLLM.js';
import { CriticalAnalysis } from '../pipeline/steps/recrute-outreach-via-email/CriticalAnalysis.js';
import { EvidenceBasedRefinement } from '../pipeline/steps/recrute-outreach-via-email/EvidenceBasedRefinement.js';
import { InsertNewlyCreatedResumePoints } from '../pipeline/steps/recrute-outreach-via-email/InsertNewlyCreatedResumePoints.js';
import { GeneratePDFStep } from '../pipeline/steps/common-steps/GeneratePDFStep.js';
import { GenerateCoverLetter } from '../pipeline/steps/common-steps/GenerateCoverLetter.js';
import { GenerateSubjectLine } from '../pipeline/steps/common-steps/GenerateSubjectLine.js';
import { SendApplicationEmail } from '../pipeline/steps/common-steps/SendApplicationEmail.js';
import { CleanupFiles } from '../pipeline/steps/common-steps/CleanupFiles.js';

interface ApplicationData {
    role: string;
    jobDescription: string;
    targetEmail: string;
    senderEmail: string;
    appPassword: string;
}

// Worker Function: Executes the actual logic
export const executeApplicationPipeline = async (applicationData: ApplicationData): Promise<any> => {
    const { role, jobDescription, targetEmail, senderEmail, appPassword } = applicationData;

    console.log(`--- Starting Pipeline for Job (Role: ${role}) ---`);

    const baseResume = getResumeByRole(role);

    // Define Pipeline
    const pipeline = new Pipeline()
        // 1. Create/Optimize Resume
        .addStep(new RewriteResumeViaLLM())
        .addStep(new CriticalAnalysis())
        .addStep(new EvidenceBasedRefinement())
        .addStep(new InsertNewlyCreatedResumePoints())

        // 2. Auxiliary Content
        .addStep(new GenerateCoverLetter())
        .addStep(new GenerateSubjectLine())

        // 3. Generate PDF
        .addStep(new GeneratePDFStep())

        // 4. Send Email
        .addStep(new SendApplicationEmail())

        // 5. Cleanup
        .addStep(new CleanupFiles());

    const result = await pipeline.execute({
        resume: baseResume,
        jobDescription,
        targetEmail: targetEmail,
        appPassword: appPassword,
        email: senderEmail, // 'email' key in context refers to Sender (User) for Nodemailer
        role,
        tokenUsage: { input: 0, output: 0, total: 0, cost: 0 }
    });

    console.log('--- Pipeline Completed Successfully ---');
    return result;
};
