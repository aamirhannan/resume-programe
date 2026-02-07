import { Step } from '../../Step.js';
import { emailService } from '../../../services/emailService.js';

import path from 'path';

export class SendApplicationEmail extends Step {
    constructor() {
        super('SendApplicationEmail');
    }

    async execute(context) {
        const { targetEmail, emailSubject, coverLetter, pdfPath, email, user_id, supabase } = context;

        if (!targetEmail) {
            throw new Error('Target email is missing in context.');
        }

        const sanitizedEmail = targetEmail.normalize('NFKC').trim();
        console.log(`Sending email to ${sanitizedEmail}...`);

        let success;

        // 1. Fetch Gmail Integration for this user
        console.log(`Looking up Gmail integration for user_id: ${user_id}`);
        let gmailAuth = null;
        if (supabase && user_id) {
            const { data, error } = await supabase
                .from('user_integrations')
                .select('*')
                .eq('user_id', user_id)
                .eq('provider', 'GMAIL')
                .single();

            if (error) {
                console.error('Error fetching Gmail integration:', error.message);
            }

            if (data && !error) {
                gmailAuth = data;
                console.log('Found Gmail Integration for user:', gmailAuth.connected_email);
            }
        } else {
            console.error('Missing supabase or user_id in context. supabase:', !!supabase, 'user_id:', user_id);
        }

        if (!gmailAuth || !gmailAuth.access_token || !gmailAuth.refresh_token) {
            throw new Error(`Gmail Integration incomplete (missing tokens) for user ${user_id}. Please reconnect your Gmail account in settings.`);
        }

        console.log('Using Gmail OAuth for SMTP...');
        success = await emailService.sendEmailWithOAuth({
            user: gmailAuth.connected_email || email,
            to: sanitizedEmail,
            subject: emailSubject || 'Job Application',
            text: coverLetter || 'Please find my resume attached.',
            accessToken: gmailAuth.access_token,
            refreshToken: gmailAuth.refresh_token,
            attachments: pdfPath ? [{
                path: pdfPath,
                filename: path.basename(pdfPath)
            }] : []
        });

        if (!success) {
            throw new Error('Gmail OAuth send returned false. Check SMTP logs.');
        }



        return {
            ...context,
            emailSent: true
        };
    }
}
