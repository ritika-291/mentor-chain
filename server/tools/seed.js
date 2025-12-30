import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Load .env relative to server root so running from /tools works too
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (!process.env.DB_HOST || !process.env.DB_USER) {
    console.error('Missing DB env vars: ensure server/.env has DB_HOST and DB_USER defined');
    process.exit(1);
}

const seed = async () => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 5
    });

    try {
        // Create a sample mentor
        const mentorEmail = 'mentor@example.com';
        const [mentorRows] = await pool.execute('SELECT * FROM users WHERE email = ?', [mentorEmail]);
        let mentorId;
        if (mentorRows.length === 0) {
            const hashed = await bcrypt.hash('password123', 10);
            const [res] = await pool.execute('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', ['Sample Mentor', mentorEmail, hashed, 'mentor']);
            mentorId = res.insertId;
            console.log('Inserted sample mentor with id', mentorId);
        } else {
            mentorId = mentorRows[0].id;
            console.log('Sample mentor already exists with id', mentorId);
        }

        // Ensure mentor profile exists
        const [profiles] = await pool.execute('SELECT * FROM mentor_profiles WHERE user_id = ?', [mentorId]);
        if (profiles.length === 0) {
            await pool.execute('INSERT INTO mentor_profiles (user_id, bio, expertise, avatar_url, hourly_rate) VALUES (?, ?, ?, ?, ?)', [mentorId, 'Experienced engineer and mentor', JSON.stringify(['career','javascript']), null, 50]);
            console.log('Created mentor profile for id', mentorId);
        } else {
            console.log('Mentor profile already present for id', mentorId);
        }

        // Create a sample mentee
        const menteeEmail = 'mentee@example.com';
        const [menteeRows] = await pool.execute('SELECT * FROM users WHERE email = ?', [menteeEmail]);
        let menteeId;
        if (menteeRows.length === 0) {
            const hashed = await bcrypt.hash('password123', 10);
            const [res2] = await pool.execute('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', ['Sample Mentee', menteeEmail, hashed, 'mentee']);
            menteeId = res2.insertId;
            console.log('Inserted sample mentee with id', menteeId);
        } else {
            menteeId = menteeRows[0].id;
            console.log('Sample mentee already exists with id', menteeId);
        }

        // Create or ensure mentor-mentee relationship
        const [relRows] = await pool.execute('SELECT * FROM mentor_mentees WHERE mentor_id = ? AND mentee_id = ?', [mentorId, menteeId]);
        if (relRows.length === 0) {
            await pool.execute('INSERT INTO mentor_mentees (mentor_id, mentee_id, status, started_at) VALUES (?, ?, ?, ?)', [mentorId, menteeId, 'active', new Date()]);
            console.log('Created mentor-mentee relationship for mentor', mentorId, 'and mentee', menteeId);
        } else {
            console.log('Mentor-mentee relationship already exists');
        }

        // Ensure there's a completed session to work with for notes/review seeds
        const [sessionRows] = await pool.execute('SELECT * FROM sessions WHERE mentor_id = ? AND mentee_id = ? LIMIT 1', [mentorId, menteeId]);
        let sessionId;
        if (sessionRows.length === 0) {
            const start = new Date(Date.now() - 3600 * 1000); // 1 hour ago
            const end = new Date(Date.now() - 1800 * 1000); // 30 mins ago
            const [sres] = await pool.execute('INSERT INTO sessions (mentor_id, mentee_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)', [mentorId, menteeId, start, end, 'completed']);
            sessionId = sres.insertId;
            console.log('Created completed session with id', sessionId);
        } else {
            sessionId = sessionRows[0].id;
            console.log('Found existing session with id', sessionId);
        }

        // Add a sample session note (mentor private)
        const [noteRows] = await pool.execute('SELECT * FROM session_notes WHERE session_id = ? LIMIT 1', [sessionId]);
        if (noteRows.length === 0) {
            await pool.execute('INSERT INTO session_notes (session_id, mentor_id, content, attachments) VALUES (?, ?, ?, ?)', [sessionId, mentorId, 'Spoke about career goals and next steps: target companies, practice system design.', JSON.stringify([])]);
            console.log('Inserted sample session note for session', sessionId);
        } else {
            console.log('Sample session note already present');
        }

        await pool.end();
        console.log('Seeding finished.');
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seed();
