
import { emailService } from './src/services/emailService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testGmailSending() {
    // 1. Check Env Vars
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.error('❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env');
        process.exit(1);
    }
    console.log('✅ Env Vars found.');

    // 2. Mock Data (You must fill this with REAL valid tokens for it to work)
    // To get these, you might need to temporarily console.log them from your QuickSetupModal or check your DB
    const mockUser = {
        user: 'aamirhannan08@gmail.com', // Replace with your connected email
        accessToken: process.env.TEST_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE',
        refreshToken: process.env.TEST_REFRESH_TOKEN || 'YOUR_REFRESH_TOKEN_HERE'
    };

    console.log('⚠️ NOTE: This test requires a valid Access/Refresh Token to verify sending.');
    console.log('Please replace the tokens in this file with real ones from your database (public.user_integrations) to test.');

    // Uncomment below to test if you have tokens

    try {
        await emailService.sendEmailWithOAuth({
            user: mockUser.user,
            to: mockUser.user, // Send to self
            subject: 'Test Email from Check Script',
            text: 'If you see this, OAuth sending is working!',
            accessToken: mockUser.accessToken,
            refreshToken: mockUser.refreshToken
        });
        console.log('✅ Email sent successfully!');
    } catch (error) {
        console.error('❌ Failed to send:', error);
    }

}

testGmailSending();
