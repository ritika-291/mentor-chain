
import pool from '../config/db.js';

const audit = async () => {
    try {
        console.log('--- Auditing Notifications ---');
        const sql = `
            SELECT u.username, u.email, n.type, n.message, n.is_read
            FROM notifications n
            JOIN users u ON n.user_id = u.id
            ORDER BY n.created_at DESC
        `;
        const [rows] = await pool.query(sql);

        if (rows.length === 0) {
            console.log('No notifications found in the system for ANY user.');
        } else {
            console.table(rows);
        }

        console.log('\n--- Checking Posts Ownership ---');
        const [posts] = await pool.query('SELECT p.id, p.content, u.username FROM community_posts p JOIN users u ON p.user_id = u.id');
        console.table(posts);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

audit();
