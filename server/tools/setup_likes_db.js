
import pool from '../config/db.js';

const createLikesTable = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to DB. Creating community_likes table...');

        const sql = `
      CREATE TABLE IF NOT EXISTS community_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

        await connection.query(sql);
        console.log('Table community_likes created successfully.');

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
};

createLikesTable();
