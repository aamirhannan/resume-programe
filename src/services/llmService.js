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

        // Lazy load OpenAI only if key is present
        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
        } else {
            console.warn('⚠️ OPENAI_API_KEY not found in env. LLM features disabled.');
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
                model: "gpt-3.5-turbo", // Use 3.5-turbo for speed/cost, or 4 for quality
                temperature: 0.2, // Low temperature for deterministic behavior
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('LLM Rewrite Error:', error);
            return bullet; // Fallback to original
        }
    }
}

export const llmService = new LLMService();
