
import db from '../config/db.js';

const Roadmap = {
    // --- Creator (Mentor) Methods ---

    async create(mentorId, title, description) {
        const sql = `INSERT INTO roadmaps (mentor_id, title, description) VALUES (?, ?, ?)`;
        const [result] = await db.execute(sql, [mentorId, title, description]);
        return result.insertId;
    },

    async addStep(roadmapId, title, description, orderIndex, resourceLink) {
        const sql = `INSERT INTO roadmap_steps (roadmap_id, title, description, order_index, resource_link) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(sql, [roadmapId, title, description, orderIndex, resourceLink]);
    },

    async getByMentor(mentorId) {
        const sql = `SELECT * FROM roadmaps WHERE mentor_id = ? ORDER BY created_at DESC`;
        const [rows] = await db.query(sql, [mentorId]);
        return rows;
    },

    // --- Consumer (Mentee) Methods ---

    async assignToUser(userId, roadmapId) {
        // Ignored if duplicate thanks to UNIQUE constraint (if exists) or check first
        // user_roadmaps (renamed from enrollments)
        const sql = `INSERT INTO user_roadmaps (user_id, roadmap_id, status) VALUES (?, ?, 'active')`;
        await db.execute(sql, [userId, roadmapId]);
    },

    async getUserRoadmaps(userId) {
        const sql = `
            SELECT r.*, ur.status as user_status, ur.enrolled_at as assigned_at,
            (SELECT COUNT(*) FROM roadmap_steps rs WHERE rs.roadmap_id = r.id) as total_steps,
            (SELECT COUNT(*) FROM user_roadmap_progress urp 
             JOIN roadmap_steps rs ON urp.step_id = rs.id 
             WHERE urp.user_id = ? AND rs.roadmap_id = r.id AND urp.completed = 1) as completed_steps
            FROM roadmaps r
            JOIN user_roadmaps ur ON r.id = ur.roadmap_id
            WHERE ur.user_id = ?
        `;
        const [rows] = await db.query(sql, [userId, userId]);
        return rows;
    },

    async getAllRoadmaps() {
        // Public listing
        const sql = `
            SELECT r.*, u.username as mentor_name,
            (SELECT COUNT(*) FROM roadmap_steps rs WHERE rs.roadmap_id = r.id) as total_steps
            FROM roadmaps r
            JOIN users u ON r.mentor_id = u.id
            ORDER BY r.created_at DESC
        `;
        const [rows] = await db.query(sql);
        return rows;
    },

    async getRoadmapDetails(roadmapId, userId = null) {
        // Get Basic Info
        console.log(`[DEBUG] Fetching roadmap details for ID: ${roadmapId}`);
        // Use LEFT JOIN for user incase user was deleted (though unlikely with FK)
        const [roadmap] = await db.query(`SELECT r.*, u.username as mentor_name FROM roadmaps r LEFT JOIN users u ON r.mentor_id = u.id WHERE r.id = ?`, [roadmapId]);

        console.log(`[DEBUG] Roadmap fetch result:`, roadmap);

        if (roadmap.length === 0) return null;

        // Get Steps
        const [steps] = await db.query(`SELECT * FROM roadmap_steps WHERE roadmap_id = ? ORDER BY order_index ASC`, [roadmapId]);
        console.log(`[DEBUG] Steps found: ${steps.length}`);

        // If UserID provided, get progress
        let progressMap = {};
        if (userId) {
            const [progress] = await db.query(`SELECT step_id, completed FROM user_roadmap_progress WHERE user_id = ? AND roadmap_id = ?`, [userId, roadmapId]);
            progress.forEach(p => progressMap[p.step_id] = p.completed);
        }

        return { ...roadmap[0], steps, userProgress: progressMap };
    },

    async updateStepProgress(userId, roadmapId, stepId, completed) {
        if (completed) {
            const sql = `
                INSERT INTO user_roadmap_progress (user_id, roadmap_id, step_id, completed, completed_at) 
                VALUES (?, ?, ?, 1, NOW()) 
                ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()
            `;
            await db.execute(sql, [userId, roadmapId, stepId]);
        } else {
            const sql = `UPDATE user_roadmap_progress SET completed = 0, completed_at = NULL WHERE user_id = ? AND step_id = ?`;
            await db.execute(sql, [userId, stepId]);
        }
    },
    async delete(roadmapId) {
        // Delete roadmap (cascading deletes steps/enrollments via FK constraints typically, or manual)
        // Assuming FK has ON DELETE CASCADE
        const sql = `DELETE FROM roadmaps WHERE id = ?`;
        await db.execute(sql, [roadmapId]);
    },

    async update(roadmapId, title, description) {
        const sql = `UPDATE roadmaps SET title = ?, description = ? WHERE id = ?`;
        await db.execute(sql, [title, description, roadmapId]);
    },

    async getOwner(roadmapId) {
        const [rows] = await db.query('SELECT mentor_id FROM roadmaps WHERE id = ?', [roadmapId]);
        return rows.length ? rows[0].mentor_id : null;
    }
};

export default Roadmap;
