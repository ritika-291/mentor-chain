import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/userModel.js';
import sendEmail from '../utils/emailUtils.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const authController = {
    async register(req, res) {
        const { username, email, password, role, bio, expertise, goals } = req.body; // Extract extra fields

        try {
            // Check if user already exists
            const existingUser = await User.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User with that email already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const lowerRole = role.toLowerCase();
            const newUser = await User.createUser({ username, email, password: hashedPassword, role: lowerRole });

            // If mentee, update goals if provided
            if (lowerRole === 'mentee' && goals) {
                await User.updateUser(newUser.insertId, { goals });
            }

            // If role is mentor, create an initial empty mentor profile
            if (lowerRole === 'mentor') {
                try {
                    const Mentor = (await import('../models/mentorModel.js')).default;
                    await Mentor.upsertProfile(newUser.insertId, {
                        bio: bio || '',
                        expertise: expertise || ''
                    });
                } catch (err) {
                    console.error('Failed to create mentor profile for new mentor:', err);
                }
            }

            // Generate JWT
            const token = jwt.sign({ id: newUser.insertId, role: lowerRole }, JWT_SECRET, { expiresIn: '1h' });

            console.log('JWT_SECRET used:', JWT_SECRET); // Added log to check JWT_SECRET value
            console.log('Sending successful registration response to frontend.'); // Added log
            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: { id: newUser.insertId, username, email, role: lowerRole }
            });

        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ message: 'Server error during registration: ' + error.message });
        }
    },

    async login(req, res) {
        const { email, password, role } = req.body; // Destructure role from req.body

        try {
            // Check if user exists
            const user = await User.findUserByEmail(email);
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // --- NEW: Role check ---
            if (user.role.toLowerCase() !== role.toLowerCase()) {
                return res.status(403).json({ message: `Access denied. You are registered as a ${user.role}.` });
            }
            // --- END NEW: Role check ---

            // Generate JWT
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({
                message: 'Logged in successfully',
                token,
                user: { id: user.id, username: user.username, email: user.email, role: user.role }
            });

        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Server error during login: ' + error.message });
        }
    },

    async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            // Check if user exists
            const user = await User.findUserByEmail(email);
            if (!user) {
                // Don't reveal if user exists for security reasons
                return res.status(200).json({
                    message: 'If an account exists with that email, a password reset link has been sent.'
                });
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

            // Save token to database
            await User.updateResetToken(user.id, resetToken, resetTokenExpires);

            // Create reset URL
            const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

            // Email content
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #14b8a6;">Reset Your Password</h2>
                    <p>Hello ${user.username || 'User'},</p>
                    <p>You requested a password reset. Click the button below to reset your password:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #14b8a6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                        Reset Password
                    </a>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="color: #666; word-break: break-all;">${resetUrl}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Best regards,<br>MentorChain Team</p>
                </div>
            `;

            // Send email
            await sendEmail(user.email, 'Reset Your Password - MentorChain', htmlContent);

            res.status(200).json({
                message: 'If an account exists with that email, a password reset link has been sent.',
                resetUrl // EXPOSED FOR DEMO/DEBUG PURPOSES
            });

        } catch (error) {
            console.error('Error during forgot password:', error);
            res.status(500).json({ message: 'Server error during password reset request' });
        }
    },

    async resetPassword(req, res) {
        const { token } = req.params;
        const { password } = req.body;

        try {
            // Find user by reset token
            const user = await User.findUserByResetToken(token);
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            // Validate password (basic validation - you can add more)
            if (!password || password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Update password and clear reset token
            await User.updatePassword(user.id, hashedPassword);

            res.status(200).json({
                message: 'Password has been reset successfully. You can now login with your new password.'
            });

        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).json({ message: 'Server error during password reset' });
        }
    },

    async changePassword(req, res) {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; // From auth middleware

        try {
            // Validate input
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Both old and new passwords are required' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'New password must be at least 6 characters long' });
            }

            // Get user
            const user = await User.findUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check old password
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid current password' });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password (using direct DB call to keep it simple, or reuse updatePassword if it supports just ID)
            // Reusing updatePassword from userModel (it handles reset token clearing too, which is fine here)
            await User.updatePassword(userId, hashedPassword);

            res.status(200).json({ message: 'Password changed successfully' });

        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ message: 'Server error during password change' });
        }
    }
};

export default authController;
