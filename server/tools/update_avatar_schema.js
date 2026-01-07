import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const updateSchema = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        console.log('Connected to database.');

        // Alter users table
        try {
            await connection.execute('ALTER TABLE users MODIFY COLUMN avatar_url LONGTEXT');
            console.log('Updated users.avatar_url to LONGTEXT.');
        } catch (error) {
            console.error('Error updating users table:', error.message);
        }

        // Alter mentor_profiles table
        try {
            await connection.execute('ALTER TABLE mentor_profiles MODIFY COLUMN avatar_url LONGTEXT');
            console.log('Updated mentor_profiles.avatar_url to LONGTEXT.');
        } catch (error) {
            console.error('Error updating mentor_profiles table:', error.message);
        }

        await connection.end();
        console.log('Schema update complete.');
        process.exit(0);
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

updateSchema();
