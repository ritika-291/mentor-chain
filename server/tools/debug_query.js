import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const testQuery = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Testing query...');
        const mentorId = 11; // ID from user error report

        const sql = `SELECT mm.mentor_id, mm.mentee_id, mm.status, mm.created_at, u.username, u.email
            FROM mentor_mentees mm
            JOIN users u ON u.id = mm.mentee_id
            WHERE mm.mentor_id = ?
            ORDER BY mm.created_at DESC
            LIMIT ? OFFSET ?`;

        const params = [mentorId, 50, 0];

        try {
            console.log('Attempt 1: Parameterized LIMIT/OFFSET');
            const [rows] = await pool.execute(sql, params);
            console.log('Query 1 success!');
        } catch (e) {
            console.error('Query 1 FAILED:', e.message);
        }

        try {
            console.log('Attempt 2: Interpolated LIMIT/OFFSET');
            const sql2 = `SELECT mm.mentor_id, mm.mentee_id, mm.status, mm.created_at, u.username, u.email
                FROM mentor_mentees mm
                JOIN users u ON u.id = mm.mentee_id
                WHERE mm.mentor_id = ?
                ORDER BY mm.created_at DESC
                LIMIT ${50} OFFSET ${0}`;
            const params2 = [mentorId];
            const [rows2] = await pool.execute(sql2, params2);
            console.log('Query 2 success!');
        } catch (e) {
            console.error('Query 2 FAILED:', e.message);
        }

        await pool.end();
    } catch (err) {
        console.error('Fatal error:', err);
    }
};

testQuery();
