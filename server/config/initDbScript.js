import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env relative to the repository/server root regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Helpful check for required DB env vars
if (!process.env.DB_HOST || !process.env.DB_USER) {
    console.error('Missing DB env vars: ensure DB_HOST and DB_USER are set in server/.env');
    process.exit(1);
}

const createDatabaseAndTables = async () => {
    try {
        // Connect to MySQL server without specifying a database initially
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        const dbName = process.env.DB_NAME;

        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`Database '${dbName}' checked/created successfully.`);

        // Close the initial connection and open a new one with the specified database
        await connection.end();

        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: dbName,
            multipleStatements: true,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Create users table if it doesn't exist (with fields for security features)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'mentee',
                emailVerified TINYINT(1) NOT NULL DEFAULT 0,
                verificationToken VARCHAR(255),
                verificationTokenExpires DATETIME,
                resetPasswordToken VARCHAR(255),
                resetPasswordExpires DATETIME,
                failedLoginAttempts INT NOT NULL DEFAULT 0,
                lockUntil DATETIME,
                avatar_url VARCHAR(512),
                goals JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table \'users\' checked/created successfully.');

        // Add avatar_url and goals columns if they don't exist (for existing databases)
        try {
            await pool.execute(`ALTER TABLE users ADD COLUMN avatar_url VARCHAR(512)`);
            console.log('Added avatar_url column to users table.');
        } catch (err) {
            if (err.code !== 'ER_DUP_FIELDNAME') {
                console.warn('Could not add avatar_url column (might already exist):', err.message);
            }
        }

        try {
            await pool.execute(`ALTER TABLE users ADD COLUMN goals JSON`);
            console.log('Added goals column to users table.');
        } catch (err) {
            if (err.code !== 'ER_DUP_FIELDNAME') {
                console.warn('Could not add goals column (might already exist):', err.message);
            }
        }

        // Mentor profiles table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS mentor_profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL UNIQUE,
                bio TEXT,
                expertise JSON,
                avatar_url VARCHAR(512),
                hourly_rate DECIMAL(10,2),
                availability_status ENUM('available','busy') DEFAULT 'available',
                average_rating DECIMAL(3,2) DEFAULT 0,
                reviews_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table \'mentor_profiles\' checked/created successfully.');

        // Mentor-Mentee relationships table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS mentor_mentees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mentor_id INT NOT NULL,
                mentee_id INT NOT NULL,
                status ENUM('requested','active','inactive') DEFAULT 'requested',
                started_at DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY uq_mentor_mentee (mentor_id, mentee_id)
            )
        `);
        console.log('Table \'mentor_mentees\' checked/created successfully.');

        // Notifications table (in-app notifications)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type VARCHAR(100) NOT NULL,
                payload JSON,
                is_read TINYINT(1) NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table \'notifications\' checked/created successfully.');

        // Availability table for mentors (recurring weekly slots or specific date ranges)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS availability (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mentor_id INT NOT NULL,
                recurring ENUM('none','weekly') DEFAULT 'none',
                day_of_week TINYINT, -- 0=Sunday .. 6=Saturday (used when recurring='weekly')
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                start_date DATE NULL,
                end_date DATE NULL,
                timezone VARCHAR(64) DEFAULT 'UTC',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table \'availability\' checked/created successfully.');

        // Calendar integrations (store OAuth tokens / provider info)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS calendar_integrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                provider VARCHAR(50) NOT NULL,
                provider_user_id VARCHAR(255),
                access_token TEXT,
                refresh_token TEXT,
                scope TEXT,
                token_expires DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table \'calendar_integrations\' checked/created successfully.');

        // Calendar events cache (for sync / conflict detection)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS calendar_events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                provider_event_id VARCHAR(255) NOT NULL,
                provider VARCHAR(50) NOT NULL,
                start_time DATETIME,
                end_time DATETIME,
                raw_event JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY uq_provider_event (user_id, provider, provider_event_id)
            )
        `);
        console.log('Table \'calendar_events\' checked/created successfully.');

        // Sessions table (bookings)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mentor_id INT NOT NULL,
                mentee_id INT NOT NULL,
                start_time DATETIME NOT NULL,
                end_time DATETIME NOT NULL,
                status ENUM('requested','accepted','rejected','cancelled','completed') DEFAULT 'requested',
                price DECIMAL(10,2),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table \'sessions\' checked/created successfully.');

        // Reviews & ratings (one review per session)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id INT NOT NULL,
                mentor_id INT NOT NULL,
                mentee_id INT NOT NULL,
                rating TINYINT NOT NULL,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
                FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY uq_review_session (session_id)
            )
        `);
        console.log('Table \'reviews\' checked/created successfully.');

        // Session notes (mentor private notes and optional attachments)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS session_notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id INT NOT NULL,
                mentor_id INT NOT NULL,
                content TEXT,
                attachments JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
                FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table \'session_notes\' checked/created successfully.');

        // Indexes to support analytics queries
        await pool.execute(`CREATE INDEX IF NOT EXISTS idx_sessions_mentor_start_status ON sessions (mentor_id, start_time, status)`);
        await pool.execute(`CREATE INDEX IF NOT EXISTS idx_mentor_mentees_mentor_status ON mentor_mentees (mentor_id, status)`);
        await pool.execute(`CREATE INDEX IF NOT EXISTS idx_reviews_mentor_created_at ON reviews (mentor_id, created_at)`);
        console.log('Indexes for analytics created/checked successfully.');

        // Conversations and messages for real-time chat
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS conversations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'conversations' checked/created successfully.");

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS conversation_participants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                conversation_id INT NOT NULL,
                user_id INT NOT NULL,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_read_message_id INT NULL,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY uq_conv_user (conversation_id, user_id)
            )
        `);
        console.log("Table 'conversation_participants' checked/created successfully.");

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                conversation_id INT NOT NULL,
                sender_id INT NOT NULL,
                text TEXT,
                attachments JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                read_at DATETIME NULL,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
                FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log("Table 'messages' checked/created successfully.");

        // Create refresh_tokens table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(512) NOT NULL,
                expires DATETIME NOT NULL,
                revoked TINYINT(1) NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table \'refresh_tokens\' checked/created successfully.');


        await pool.end();
        console.log('Database initialization script finished.');

    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1); // Exit with error
    }
};

createDatabaseAndTables();
