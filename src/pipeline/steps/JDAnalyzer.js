import { Step } from '../Step.js';

export class JDAnalyzer extends Step {
    constructor() {
        super('JDAnalyzer');
    }

    async execute(context) {
        const { jobDescription } = context;
        if (!jobDescription) throw new Error('Job Description is missing');

        const jdLower = jobDescription.toLowerCase();

        // Basic Regex-based extraction (can be enhanced with NLP libraries later)
        // This is a placeholder for a more sophisticated analyzer
        const hardSkills = this.extractHardSkills(jdLower);
        const softSkills = this.extractSoftSkills(jdLower);
        const seniority = this.extractSeniority(jdLower);

        return {
            ...context,
            signals: {
                hardSkills,
                softSkills,
                seniority,
                allKeywords: [...hardSkills, ...softSkills, ...seniority]
            }
        };
    }

    extractHardSkills(text) {
        // List of common tech skills to look for
        const techKeywords = [
            'react', 'react.js', 'node', 'node.js', 'express', 'express.js', 'javascript', 'typescript',
            'html', 'css', 'redux', 'context api', 'graphql', 'mongodb', 'mysql', 'postgresql', 'redis',
            'docker', 'aws', 'kubernetes', 'jenkins', 'ci/cd', 'git', 'rest api', 'microservices',
            'next.js', 'vue', 'angular', 'python', 'java', 'c#', 'golang', 'rust', 'material ui', 'tailwind'
        ];

        return techKeywords.filter(keyword => text.includes(keyword));
    }

    extractSoftSkills(text) {
        const softKeywords = [
            'leadership', 'communication', 'collaboration', 'agile', 'scrum', 'problem solving',
            'mentorship', 'ownership', 'team player', 'adaptability'
        ];
        return softKeywords.filter(keyword => text.includes(keyword));
    }

    extractSeniority(text) {
        const seniorityKeywords = ['senior', 'lead', 'principal', 'architect', 'manager', 'junior', 'entry level'];
        return seniorityKeywords.filter(keyword => text.includes(keyword));
    }
}
