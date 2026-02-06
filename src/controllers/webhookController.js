
import crypto from 'crypto';
import { getAuthenticatedClient } from '../utils/supabaseClientHelper.js'; // Note: Webhooks might need a service role client if not auth'd by user
import { createClient } from '@supabase/supabase-js';
import * as dbController from '../DatabaseController/paymentDatabaseController.js';

// We need a Service Role client because Webhooks are not authenticated by a user session
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handleRazorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature'];
        const body = JSON.stringify(req.body);

        if (!secret) {
            console.error("RAZORPAY_WEBHOOK_SECRET is not set");
            return res.status(500).send("Server Configuration Error");
        }

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error("Invalid Webhook Signature");
            return res.status(400).send("Invalid Signature");
        }

        const event = req.body.event;
        const payload = req.body.payload;

        console.log(`Received Razorpay Webhook: ${event}`);

        if (event === 'refund.processed') {
            const refund = payload.refund.entity;
            const paymentId = refund.payment_id; // The original payment ID

            console.log(`Processing refund for payment: ${paymentId}`);

            await dbController.markPurchaseAsRefunded(supabaseAdmin, paymentId);

            console.log(`Refund processed for payment ${paymentId}`);
        }

        res.status(200).send("OK");

    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
