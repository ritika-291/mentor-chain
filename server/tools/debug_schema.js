import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const checkSchema = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to DB.');

        const [usersCols] = await connection.execute('DESCRIBE users');
        console.log('Users columns:', usersCols.map(c => c.Field));

        const [mmCols] = await connection.execute('DESCRIBE mentor_mentees');
        console.log('Mentor_Mentees columns:', mmCols.map(c => c.Field));

        await connection.end();
    } catch (err) {
        console.error('Error checking schema:', err);
    }
};

checkSchema();
