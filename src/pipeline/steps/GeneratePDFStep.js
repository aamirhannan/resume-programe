import { Step } from '../Step.js';
import { createPDF } from '../../services/pdfGenerator.js';
import fs from 'fs';
import path from 'path';

export class GeneratePDFStep extends Step {
    constructor() {
        super('GeneratePDFStep');
    }

    async execute(context) {
        const { finalResume, role } = context;

        // Prefer evidence-based result, fallback to finalResume (rewritten), then original if somehow missing (though Rewritten should exist)
        const resumeToPrint = finalResume;

        if (!resumeToPrint) {
            throw new Error('Missing resume data (finalResume) for PDF generation.');
        }

        console.log('Generating PDF...');
        const pdfBuffer = await createPDF(resumeToPrint);

        // Save to a temporary path
        const fileName = `Resume_${role || 'Application'}_${Date.now()}.pdf`;
        const filePath = path.resolve(process.cwd(), fileName);

        fs.writeFileSync(filePath, pdfBuffer);
        console.log(`PDF saved to ${filePath}`);

        return {
            ...context,
            pdfPath: filePath
        };
    }
}
