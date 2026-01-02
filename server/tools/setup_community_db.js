
import pool from '../config/db.js';

const createCommunityTable = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to DB. Creating community_posts table...');

        const sql = `
      CREATE TABLE IF NOT EXISTS community_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        likes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

        await connection.query(sql);
        console.log('Table community_posts created successfully (or already exists).');

        // Add check for comments table? Maybe later or now. Let's do just posts first as per plan, but comments would be nice. 
        // Plan said "Create community_posts and community_comments tables".

        const commentsSql = `
      CREATE TABLE IF NOT EXISTS community_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;
        await connection.query(commentsSql);
        console.log('Table community_comments created successfully.');

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
};

createCommunityTable();
