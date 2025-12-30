import mysql from 'mysql2/promise';
import dotenv from 'dotenv'; // Import dotenv for ES modules
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file relative to this config folder to be robust when called from different CWDs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') }); // server/.env

if (!process.env.DB_HOST || !process.env.DB_USER) {
    console.error('Missing DB env vars: ensure DB_HOST and DB_USER are set in server/.env');
    process.exit(1);
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // Use DB_NAME from .env
    multipleStatements: true,
});

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to the MySQL database!');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('Error connecting to the database:', err.stack);
    });

export default pool; // Export the pool directly