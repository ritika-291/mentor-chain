
import pool from '../config/db.js';
import Notification from '../models/notificationModel.js';
import Community from '../models/communityModel.js';

const debug = async () => {
    try {
        console.log('--- Checking Notifications Table ---');
        const [rows] = await pool.query('SELECT * FROM notifications');
        console.log(`Total Notifications: ${rows.length}`);
        console.log(rows);

        console.log('\n--- Checking Community Posts Schema ---');
        const [columns] = await pool.query('SHOW COLUMNS FROM community_posts');
        console.log('Columns:', columns.map(c => c.Field).join(', '));

        // Test getOwner
        console.log('\n--- Testing getOwner ---');
        // Find a post
        const [posts] = await pool.query('SELECT id, user_id FROM community_posts LIMIT 1');
        if (posts.length > 0) {
            const post = posts[0];
            console.log(`Testing with Post ID: ${post.id}, Expected Owner: ${post.user_id}`);
            const ownerId = await Community.getOwner(post.id);
            console.log(`Fetched Owner ID: ${ownerId}`);

            if (ownerId === post.user_id) {
                console.log('getOwner works correctly.');

                // Try creating a notification manually
                console.log('\n--- Testing Notification Creation ---');
                // Create dummy notification for this owner
                await Notification.create(ownerId, 'system', 'Debug notification', post.id);
                console.log('Dummy notification created.');

                const [newRows] = await pool.query('SELECT * FROM notifications WHERE user_id = ?', [ownerId]);
                console.log('User Notifications:', newRows);
            } else {
                console.error('getOwner FAILED match.');
            }
        } else {
            console.log('No posts found to test getOwner.');
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

debug();
