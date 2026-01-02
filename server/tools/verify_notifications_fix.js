
import Notification from '../models/notificationModel.js';
import pool from '../config/db.js';

const verify = async () => {
    try {
        console.log('--- Verifying Notification Fix ---');
        // Pick a user ID that likely exists (e.g., from previous logs, User 8) or just try ID 1
        const userId = 8;
        console.log(`Fetching notifications for User ${userId}...`);

        const notifications = await Notification.listForUser(userId, { limit: 10, offset: 0 });
        console.log('Success! Notifications fetched:', notifications);

        process.exit(0);
    } catch (e) {
        console.error('Verification Failed:', e);
        process.exit(1);
    }
};

verify();
