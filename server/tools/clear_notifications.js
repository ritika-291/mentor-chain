
import pool from '../config/db.js';

const clear = async () => {
    try {
        console.log('Clearing all notifications...');
        await pool.execute('DELETE FROM notifications');
        console.log('Notifications cleared.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

clear();
