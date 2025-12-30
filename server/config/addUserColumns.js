import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const addColumnsToUsersTable = async () => {
    try {
        // Connect to MySQL server
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log('Connected to database. Adding columns to users table...');

        // Check if avatar_url column exists, if not add it
        try {
            await connection.execute(`
                ALTER TABLE users 
                ADD COLUMN avatar_url VARCHAR(512) NULL
            `);
            console.log('✅ Added avatar_url column to users table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('✓ avatar_url column already exists.');
            } else {
                throw err;
            }
        }

        // Check if goals column exists, if not add it
        try {
            await connection.execute(`
                ALTER TABLE users 
                ADD COLUMN goals JSON NULL
            `);
            console.log('✅ Added goals column to users table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('✓ goals column already exists.');
            } else {
                throw err;
            }
        }

        await connection.end();
        console.log('✅ Database migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Error during database migration:', error.message);
        process.exit(1);
    }
};

addColumnsToUsersTable();
