
import pool from '../config/db.js';

const check = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM roadmaps');
        console.log('Roadmaps count:', rows.length);
        console.log(rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();
