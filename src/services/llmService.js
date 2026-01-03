import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (assuming src/services/llmService.js)
// .env is at d:/resume-programe/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class LLMService {
    constructor() {
        this.openai = null;
        this.model = "gpt-5.2";
        this.temperature = 0.2;

        // Lazy load OpenAI only if key is present
        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
        } else {
            console.warn('⚠️ OPENAI_API_KEY not found in env. LLM features disabled.');
        }
    }

    async generateContent(userPrompt, systemPrompt) {
        if (!this.openai) return userPrompt;

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                model: this.model,
                temperature: this.temperature,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('LLM Generation Error:', error);
            return null;
        }
    }

    /**
     * Rewrites a resume bullet point with strict constraints.
     * @param {string} bullet - Original bullet point.
     * @param {string} startVerb - The verb to start the sentence with (e.g., "Optimized").
     * @param {string[]} allowedKeywords - List of keywords that MUST be used/preserved.
     * @returns {Promise<string>} - The rewritten bullet.
     */
    async rewriteBullet(bullet, startVerb, allowedKeywords) {
        if (!this.openai) return bullet;

        const systemPrompt = `You are a strict Technical Editor. Your job is to rewrite resume bullet points to match a specific tone and keyword set.
Rules:
1. Start the sentence with the exact verb: "${startVerb}".
2. Do NOT add any new skills, tools, or technologies that are not in the input.
3. Preserve all numbers, metrics, and technical constraints exactly as they are.
4. Use ONLY the provided allowed keywords if they appear in the original text or context.
5. Keep the output concise (under 35 words).
6. Do not change the meaning of the work done.
`;

        const userPrompt = `
Original Bullet: "${bullet}"
Allowed Keywords: ${allowedKeywords.join(', ')}

Rewrite with start verb: "${startVerb}"
`;

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                model: "gpt-5.2",
                temperature: 0.2,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('LLM Rewrite Error:', error);
            return bullet;
        }
    }

    /**
     * Extracts IMPLIED technical skills from a Job Description.
     * @param {string} validSkillsList - List of known ontology skills to map to.
     * @param {string} jdText - The job description text.
     * @returns {Promise<string[]>} - List of implied skills found.
     */
    async extractImpliedSkills(jdText, validSkillsList) {
        if (!this.openai) return [];

        const systemPrompt = `You are a Semantic Skill Classifier. 
Your job is to identify IMPLIED technical skills in a Job Description that might not be explicitly named but are required by context.
Rules:
1. Return ONLY concepts that map to the provided "Valid Skills List".
2. If a skill is explicitly mentioned in the text, IGNORE it (we have regex for that).
3. Look for phrases like "low-latency systems" (implies C++/Rust/Go) or "containerization" (implies Docker).
4. Output strict JSON array of strings. e.g. ["docker", "redis"]
`;

        const userPrompt = `
Valid Skills List: ${JSON.stringify(validSkillsList)}
Job Description:
"${jdText.substring(0, 1500)}" 

Return JSON Array of implied skills:
`;

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                model: this.model,
                temperature: this.temperature,
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(completion.choices[0].message.content);
            return result.skills || result.impliedSkills || [];
        } catch (error) {
            console.error('LLM Extraction Error:', error);
            return [];
        }
    }

    /**
     * get the hard and soft skill from job description
     */

    async generateResumeContent(prompt) {
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: "system", content: prompt },
                ],
                model: this.model,
                temperature: this.temperature,
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(completion.choices[0].message.content);
            return result
        } catch (error) {
            console.error('LLM Extraction Error:', error);
            return [];
        }
    }

}

export const llmService = new LLMService();
