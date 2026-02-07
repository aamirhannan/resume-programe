import nodemailer from 'nodemailer';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class EmailService {
    constructor() {
        // Stateless service
    }

    async sendEmail({ from, to, subject, text, html, attachments = [] }) {
        if (!this.transporter) {
            throw new Error('Transporter not initialized');
        }
        return this._send(this.transporter, { from, to, subject, text, html, attachments });
    }

    async sendEmailWithOAuth({ user, accessToken, refreshToken, to, subject, text, attachments = [] }) {
        console.log(`Preparing to send email via OAuth for user: ${user}`);

        // Always refresh the access token to ensure it's valid
        let validAccessToken = accessToken;
        let tokenRefreshed = false;

        try {
            console.log('Attempting to refresh access token...');
            const refreshedToken = await this._refreshAccessToken(refreshToken);
            if (refreshedToken) {
                validAccessToken = refreshedToken;
                tokenRefreshed = true;
                console.log('Successfully refreshed access token from Google.');

                // DEBUG: Verify who this token belongs to
                try {
                    const tokenInfo = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${validAccessToken}`);
                    console.log('DEBUG - Token belongs to email:', tokenInfo.data.email);
                    console.log('DEBUG - Token scopes:', tokenInfo.data.scope);

                    if (user && tokenInfo.data.email && user.toLowerCase().trim() !== tokenInfo.data.email.toLowerCase().trim()) {
                        console.error(`CRITICAL MISMATCH: Trying to send as '${user}' but token belongs to '${tokenInfo.data.email}'`);
                    }
                } catch (infoError) {
                    console.warn('Could not verify token info:', infoError.message);
                }
            } else {
                console.warn('Token refresh response did not contain an access_token.');
            }
        } catch (refreshError) {
            console.error('FAILED to refresh token:', refreshError.message);
            console.warn('Attempting to send with existing (potentially expired) token...');
        }

        // STRATEGY: SMTP authentication is failing (535) despite valid token.
        // We will switch to the Gmail REST API which is more robust for OAuth tokens.

        console.log('Switching to Gmail REST API for sending...');

        try {
            // 1. Create the Raw MIME message using Nodemailer (but not sending it via SMTP)
            const streamTransporter = nodemailer.createTransport({
                streamTransport: true,
                newline: 'unix',
                buffer: true
            });

            const mailOptions = {
                from: user,
                to: to,
                subject: subject,
                text: text,
                attachments: attachments
            };

            const info = await streamTransporter.sendMail(mailOptions);
            const rawMessage = info.message.toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            // 2. Send via Gmail API
            const sendResponse = await axios.post(
                'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
                { raw: rawMessage },
                {
                    headers: {
                        'Authorization': `Bearer ${validAccessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Email sent via REST API! ID:', sendResponse.data.id);
            return true;

        } catch (apiError) {
            console.error('REST API Send Failed:', apiError.response ? apiError.response.data : apiError.message);
            throw new Error(`Gmail API Error: ${apiError.response ? JSON.stringify(apiError.response.data) : apiError.message}`);
        }
    }

    async _refreshAccessToken(refreshToken) {
        try {
            const response = await axios.post('https://oauth2.googleapis.com/token', {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return response.data.access_token;
        } catch (error) {
            const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
            throw new Error(`Token refresh failed: ${errorMsg}`);
        }
    }

    async _send(transporter, mailOptions) {
        if (!transporter) return false;
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: %s', info.messageId);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            // Enhanced error logging for OAuth
            if (error.response) {
                console.error('SMTP Response:', error.response);
            }
            throw error;
        }
    }
}
export const emailService = new EmailService();
