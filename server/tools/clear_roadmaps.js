
import pool from '../config/db.js';

const clear = async () => {
    try {
        console.log('Clearing all roadmaps...');
        // Delete all roadmaps (cascades to steps and progress due to FK constraints)
        await pool.execute('DELETE FROM roadmaps');
        // Reset Auto Increment (optional, but nice for "real" start)
        await pool.execute('ALTER TABLE roadmaps AUTO_INCREMENT = 1');
        await pool.execute('ALTER TABLE roadmap_steps AUTO_INCREMENT = 1');

        console.log('Roadmaps table cleared successfully. Ready for real data.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

clear();
