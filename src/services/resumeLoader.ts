import { frontend } from '../data/resumes/frontend.js';
import { backend } from '../data/resumes/backend.js';
import { fullStack } from '../data/resumes/fullStack.js';
import { softwareEngineer } from '../data/resumes/softwareEngineer.js';
import { Resume } from '../models/Resume.js';

export const getResumeByRole = (role: string): Resume => {
    const normalizedRole = role.toLowerCase().replace('-', '').replace(' ', '');
    switch (normalizedRole) {
        case 'frontend':
            return frontend;
        case 'backend':
            return backend;
        case 'fullstack':
            return fullStack;
        case 'softwareengineer':
            return softwareEngineer;
        default:
            return softwareEngineer;
    }
};
