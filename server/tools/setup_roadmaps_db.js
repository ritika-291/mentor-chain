
import pool from '../config/db.js';

const createRoadmapTables = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to DB. Creating roadmap tables...');

        // Roadmaps table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS roadmaps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mentor_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

        // Roadmap Steps table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS roadmap_steps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            roadmap_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            order_index INT NOT NULL,
            resource_link VARCHAR(255),
            FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    `);

        // User Roadmap Progress table
        // Tracks individual steps checked off by a mentee
        await connection.query(`
        CREATE TABLE IF NOT EXISTS user_roadmap_progress (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            roadmap_id INT NOT NULL,
            step_id INT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            completed_at TIMESTAMP NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
            FOREIGN KEY (step_id) REFERENCES roadmap_steps(id) ON DELETE CASCADE,
            UNIQUE KEY unique_progress (user_id, step_id) 
        ) ENGINE=InnoDB;
    `);

        // Assignment table (Mentor assigns roadmap to mentee?) 
        // Or we just infer assignment if they have progress. 
        // Let's add an explicit assignment table so they can see "My Roadmaps" even with 0 progress.
        await connection.query(`
        CREATE TABLE IF NOT EXISTS user_roadmaps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            roadmap_id INT NOT NULL,
            status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
            UNIQUE KEY unique_assignment (user_id, roadmap_id)
        ) ENGINE=InnoDB;
    `);

        console.log('Roadmap tables created successfully.');
        connection.release();
        process.exit(0);

    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
};

createRoadmapTables();
