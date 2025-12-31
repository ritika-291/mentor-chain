
import db from '../config/db.js';

const checkSessions = async () => {
    try {
        console.log("Checking last 5 sessions in DB...");
        const [rows] = await db.execute('SELECT * FROM sessions ORDER BY id DESC LIMIT 5');

        console.log("Current Server Time (new Date()):", new Date().toString());
        console.log("Current Server UTC:", new Date().toISOString());

        if (rows.length === 0) {
            console.log("No sessions found.");
        } else {
            rows.forEach(r => {
                console.log(`[${r.id}] Mentor:${r.mentor_id} | Mentee:${r.mentee_id} | Start:${new Date(r.start_time).toISOString()} | Status:${r.status}`);
            });
        }

        console.log("\n--- Testing Session.listForMentor(13) ---");
        const list = await import('../models/sessionModel.js').then(m => m.default.listForMentor(13));
        console.log(`Found ${list.length} sessions via Model`);
        list.forEach(r => console.log(`[Model] ID:${r.id} Start:${r.start_time}`));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkSessions();
