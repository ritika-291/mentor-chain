
import pool from '../config/db.js';

const setup = async () => {
    try {
        console.log('Creating notifications table...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type VARCHAR(50) NOT NULL, -- 'like', 'comment', 'system'
                message TEXT,
                related_id INT, -- e.g., post_id
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);

        console.log('Notifications table created successfully.');
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

setup();
