
import db from './config/db.js';

async function fixSchema() {
    try {
        console.log('Fixing roadmap_steps schema...');
        try {
            await db.query('ALTER TABLE roadmap_steps ADD COLUMN order_index INT DEFAULT 0');
            console.log('Added order_index to roadmap_steps');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('order_index already exists in roadmap_steps');
            } else {
                console.error('Error altering roadmap_steps:', e.message);
            }
        }

        console.log('Fixing notifications schema...');
        // Check current columns first to be safe
        const [columns] = await db.query('DESCRIBE notifications');
        const colNames = columns.map(c => c.Field);

        if (!colNames.includes('message')) {
            await db.query('ALTER TABLE notifications ADD COLUMN message TEXT');
            console.log('Added message to notifications');
        }

        if (!colNames.includes('related_id')) {
            await db.query('ALTER TABLE notifications ADD COLUMN related_id INT');
            console.log('Added related_id to notifications');
        }

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
}

fixSchema();
