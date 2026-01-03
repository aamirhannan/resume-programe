import { Step } from '../Step.js';
import { llmService } from '../../services/llmService.js';
import { rewriteResumePrompt } from '../../prompts/userPrompt.js';

export class RewriteResumeViaLLM extends Step {
    constructor() {
        super('RewriteResumeViaLLM');
    }

    async execute(context) {
        const { jobDescription, resume } = context;
        if (!resume) throw new Error('Resume is missing');

        // const {
        //     professionalSummary,
        //     technicalSkills,
        //     jobResponsibilities,
        //     techStack,
        //     project
        // } = resume;

        const professionalSummary = resume.professionalSummary;
        const technicalSkills = resume.technicalSkills;
        const responsibilitiesAndAchievements = resume.experience[0].responsibilitiesAndAchievements;
        const technologies = resume.experience[0].technologies;
        const projects = resume.projects;


        const finalPrompt = rewriteResumePrompt({
            jobDescription,
            professionalSummary,
            technicalSkills,
            responsibilitiesAndAchievements,
            technologies,
            projects
        })

        const rewrittenResume = await llmService.generateResumeContent(finalPrompt);

        return {
            ...context,
            rewrittenResume
        };
    }
}