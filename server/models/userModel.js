import db from '../config/db.js';

const User = {
    async createUser(userData) {
        const { username, email, password, role } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role]
        );
        return result;
    },

    async findUserByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0]; // Return the first user found, or undefined
    },

    async findUserById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Reset password token
    async updateResetToken(userId, token, expires) {
        const [result] = await db.execute(
            'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
            [token, expires, userId]
        );
        return result;
    },

    async findUserByResetToken(token) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW()',
            [token]
        );
        return rows[0];
    },

    async updatePassword(userId, newHashedPassword) {
        const [result] = await db.execute(
            'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
            [newHashedPassword, userId]
        );
        return result;
    },

    // Verification token
    async setVerificationToken(userId, token, expires) {
        const [result] = await db.execute(
            'UPDATE users SET verificationToken = ?, verificationTokenExpires = ? WHERE id = ?',
            [token, expires, userId]
        );
        return result;
    },

    async findUserByVerificationToken(token) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE verificationToken = ? AND verificationTokenExpires > NOW()',
            [token]
        );
        return rows[0];
    },

    async markEmailVerified(userId) {
        const [result] = await db.execute(
            'UPDATE users SET emailVerified = 1, verificationToken = NULL, verificationTokenExpires = NULL WHERE id = ?',
            [userId]
        );
        return result;
    },

    // Refresh token store
    async saveRefreshToken(userId, token, expires) {
        const [result] = await db.execute(
            'INSERT INTO refresh_tokens (user_id, token, expires) VALUES (?, ?, ?)',
            [userId, token, expires]
        );
        return result;
    },

    async findRefreshToken(token) {
        const [rows] = await db.execute(
            'SELECT * FROM refresh_tokens WHERE token = ? AND revoked = 0 AND expires > NOW()',
            [token]
        );
        return rows[0];
    },

    async revokeRefreshToken(token) {
        const [result] = await db.execute(
            'UPDATE refresh_tokens SET revoked = 1 WHERE token = ?',
            [token]
        );
        return result;
    },

    async revokeAllRefreshTokensForUser(userId) {
        const [result] = await db.execute(
            'UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?',
            [userId]
        );
        return result;
    },

    // Login attempt tracking
    async incrementFailedLogin(userId) {
        const [result] = await db.execute(
            'UPDATE users SET failedLoginAttempts = failedLoginAttempts + 1 WHERE id = ?',
            [userId]
        );
        return result;
    },

    async resetFailedLogins(userId) {
        const [result] = await db.execute(
            'UPDATE users SET failedLoginAttempts = 0, lockUntil = NULL WHERE id = ?',
            [userId]
        );
        return result;
    },

    async setLockUntil(userId, untilDate) {
        const [result] = await db.execute(
            'UPDATE users SET lockUntil = ? WHERE id = ?',
            [untilDate, userId]
        );
        return result;
    },

    // Update user profile
    async updateUser(userId, fields) {
        const updates = [];
        const values = [];

        if (fields.username !== undefined) { updates.push('username = ?'); values.push(fields.username); }
        if (fields.email !== undefined) { updates.push('email = ?'); values.push(fields.email); }
        if (fields.avatar_url !== undefined) { updates.push('avatar_url = ?'); values.push(fields.avatar_url); }
        if (fields.goals !== undefined) { 
            updates.push('goals = ?'); 
            values.push(fields.goals ? JSON.stringify(fields.goals) : null); 
        }

        if (updates.length === 0) return null;

        values.push(userId);
        const [result] = await db.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
        return result;
    }

   
};


export default User;