import { Step } from "../Step.js";

export class InsertNewlyCreatedResumePoints extends Step {
    constructor() {
        super('InsertNewlyCreatedResumePoints');
    }

    async execute(context) {
        const { rewrittenResume, resume } = context;
        if (!rewrittenResume) throw new Error('Resume is missing');

        const { professionalSummary, projects, responsibilitiesAndAchievements, technicalSkills, technologies } = rewrittenResume;

        const finalResume = resume;
        finalResume.professionalSummary = professionalSummary;
        finalResume.technicalSkills = JSON.parse(technicalSkills, null, 2);
        finalResume.experience[0].responsibilitiesAndAchievements = JSON.parse(responsibilitiesAndAchievements, null, 2);
        finalResume.experience[0].technologies = JSON.parse(technologies, null, 2);
        finalResume.projects = JSON.parse(projects, null, 2);

        return {
            ...context,
            finalResume
        };
    }
}