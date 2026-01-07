
import db from './config/db.js';

async function checkSchema() {
    try {
        console.log('--- Roadmap Steps Schema ---');
        const [stepsColumns] = await db.query('DESCRIBE roadmap_steps');
        console.table(stepsColumns);

        console.log('--- Notifications Schema ---');
        const [notifColumns] = await db.query('DESCRIBE notifications');
        console.table(notifColumns);

    } catch (err) {
        console.error('Error fetching schema:', err);
    } finally {
        process.exit();
    }
}

checkSchema();
