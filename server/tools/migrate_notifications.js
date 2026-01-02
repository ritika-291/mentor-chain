
import pool from '../config/db.js';

const migrate = async () => {
    try {
        console.log('Migrating notifications table...');

        // Add message column if not exists
        try {
            await pool.execute('ALTER TABLE notifications ADD COLUMN message TEXT');
            console.log('Added message column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('message column already exists.');
            else throw e;
        }

        // Add related_id column if not exists
        try {
            await pool.execute('ALTER TABLE notifications ADD COLUMN related_id INT'); // Optional FK constraint? Skipping for simplicity now.
            console.log('Added related_id column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('related_id column already exists.');
            else throw e;
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

migrate();
