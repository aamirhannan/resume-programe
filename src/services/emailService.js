import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class EmailService {
    constructor() {
        // Stateless service
    }

    // Removed init() as verified credentials are now required per-request

    async sendEmail({ from, to, subject, text, html, attachments = [] }) {
        // ... (Keep existing implementation for backward compatibility or remove if strictly moving to dynamic)
        if (!this.transporter) {
            // Fallback to init if missing? 
            // Logic stays same for default env usage
        }
        // ...
        return this._send(this.transporter, { from, to, subject, text, html, attachments });
    }

    async sendEmailWithAuth({ user, pass, to, subject, text, html, attachments = [] }) {
        const transporter = await this._createTransporter(user, pass);
        return this._send(transporter, { from: user, to, subject, text, html, attachments });
    }

    async verifyCredentials(user, pass) {
        try {
            const tempTransporter = await this._createTransporter(user, pass);
            await tempTransporter.verify();
            return true;
        } catch (error) {
            console.error('SMTP Credential Check Failed:', error);
            return false;
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
            throw error; // Propagate error so worker knows it failed
        }
    }

    async _createTransporter(user, pass) {
        let host = 'smtp.gmail.com';
        try {
            // Manually resolve to IPv4 to bypass any IPv6 routing issues on cloud providers
            const addresses = await resolve4('smtp.gmail.com');
            if (addresses && addresses.length > 0) {
                host = addresses[0];
                console.log(`Resolved smtp.gmail.com to IPv4: ${host}`);
            }
        } catch (err) {
            console.warn('DNS IPv4 resolution failed, falling back to hostname:', err.message);
        }

        return nodemailer.createTransport({
            host: host,
            port: 465,
            secure: true,
            auth: { user, pass },
            tls: {
                servername: 'smtp.gmail.com' // Critical: Matches cert against hostname, not IP
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000
        });
    }
}

export const emailService = new EmailService();
