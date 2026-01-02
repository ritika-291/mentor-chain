
import db from '../config/db.js';

const Community = {
    async create(userId, content) {
        const sql = `INSERT INTO community_posts (user_id, content) VALUES (?, ?)`;
        const [result] = await db.execute(sql, [userId, content]);
        return result.insertId;
    },

    async getAll(currentUserId) {
        const sql = `
            SELECT p.*, u.username, u.role, p.created_at,
            (SELECT COUNT(*) FROM community_comments c WHERE c.post_id = p.id) as comment_count,
            (SELECT COUNT(*) FROM community_likes cl WHERE cl.post_id = p.id AND cl.user_id = ?) > 0 as is_liked
            FROM community_posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.query(sql, [currentUserId]);
        return rows;
    },

    async toggleLike(postId, userId) {
        // Check if like exists using a transaction or simple query
        const checkSql = `SELECT id FROM community_likes WHERE post_id = ? AND user_id = ?`;
        const [existing] = await db.query(checkSql, [postId, userId]);

        if (existing.length > 0) {
            // Unlike
            await db.execute(`DELETE FROM community_likes WHERE post_id = ? AND user_id = ?`, [postId, userId]);
            await db.execute(`UPDATE community_posts SET likes = GREATEST(likes - 1, 0) WHERE id = ?`, [postId]);
            return 'unliked';
        } else {
            // Like
            await db.execute(`INSERT INTO community_likes (post_id, user_id) VALUES (?, ?)`, [postId, userId]);
            await db.execute(`UPDATE community_posts SET likes = likes + 1 WHERE id = ?`, [postId]);
            return 'liked';
        }
    },

    async addComment(postId, userId, content) {
        const sql = `INSERT INTO community_comments (post_id, user_id, content) VALUES (?, ?, ?)`;
        const [result] = await db.execute(sql, [postId, userId, content]);
        return result.insertId;
    },

    async getComments(postId) {
        const sql = `
            SELECT c.*, u.username, u.avatar_url 
            FROM community_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `;
        const [rows] = await db.query(sql, [postId]);
        return rows;
    },

    async getOwner(postId) {
        const [rows] = await db.query('SELECT user_id FROM community_posts WHERE id = ?', [postId]);
        return rows.length ? rows[0].user_id : null;
    }
};

export default Community;
