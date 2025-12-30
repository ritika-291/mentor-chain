import User from '../models/userModel.js';
import Mentor from '../models/mentorModel.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profileController = {
    // Get user profile (works for both mentor and mentee)
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            
            // Get user data
            const user = await User.findUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            let profileData = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.created_at
            };

            // If mentor, get mentor profile data
            if (user.role === 'mentor' || user.role === 'Mentor') {
                const mentorProfile = await Mentor.getByUserId(userId);
                if (mentorProfile) {
                    profileData.profile = {
                        bio: mentorProfile.bio,
                        expertise: mentorProfile.expertise ? (typeof mentorProfile.expertise === 'string' ? JSON.parse(mentorProfile.expertise) : mentorProfile.expertise) : [],
                        avatar_url: mentorProfile.avatar_url,
                        hourly_rate: mentorProfile.hourly_rate,
                        availability_status: mentorProfile.availability_status,
                        average_rating: mentorProfile.average_rating,
                        reviews_count: mentorProfile.reviews_count
                    };
                } else {
                    profileData.profile = {
                        bio: null,
                        expertise: [],
                        avatar_url: null,
                        hourly_rate: null,
                        availability_status: 'available'
                    };
                }
            } else {
                // For mentees, include avatar_url and goals from users table
                let goalsArray = [];
                if (user.goals) {
                    try {
                        goalsArray = typeof user.goals === 'string' ? JSON.parse(user.goals) : user.goals;
                        console.log('Retrieved goals from DB for mentee:', goalsArray); // Debug log
                    } catch (err) {
                        console.error('Error parsing goals from DB:', err);
                        goalsArray = [];
                    }
                }
                profileData.profile = {
                    avatar_url: user.avatar_url || null,
                    goals: goalsArray
                };
            }

            res.status(200).json(profileData);
        } catch (error) {
            console.error('Error getting profile:', error);
            res.status(500).json({ message: 'Server error getting profile' });
        }
    },

    // Update user profile
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { username, bio, expertise, hourly_rate, availability_status, goals } = req.body;

            // Get user first to check role
            const user = await User.findUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update user basic info
            const userUpdates = {};
            if (username) userUpdates.username = username;
            
            // For mentees, handle goals
            if ((user.role === 'mentee' || user.role === 'Mentee') && goals !== undefined) {
                console.log('Saving goals for mentee:', goals); // Debug log
                userUpdates.goals = goals;
            }

            if (Object.keys(userUpdates).length > 0) {
                console.log('Updating user with:', userUpdates); // Debug log
                await User.updateUser(userId, userUpdates);
            }

            // Update mentor profile if user is a mentor
            if ((user.role === 'mentor' || user.role === 'Mentor') && (bio !== undefined || expertise !== undefined || hourly_rate !== undefined || availability_status !== undefined)) {
                const mentorUpdates = {};
                if (bio !== undefined) mentorUpdates.bio = bio;
                if (expertise !== undefined) {
                    // Handle expertise as string or array
                    mentorUpdates.expertise = Array.isArray(expertise) ? expertise : (typeof expertise === 'string' ? expertise.split(',').map(e => e.trim()) : []);
                }
                if (hourly_rate !== undefined) mentorUpdates.hourly_rate = hourly_rate;
                if (availability_status !== undefined) mentorUpdates.availability_status = availability_status;

                await Mentor.upsertProfile(userId, mentorUpdates);
            }

            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ message: 'Server error updating profile' });
        }
    },

    // Upload profile picture
    async uploadProfilePicture(req, res) {
        try {
            const userId = req.user.id;
            
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const fileUrl = `/uploads/${req.file.filename}`;
            const user = await User.findUserById(userId);

            // If mentor, update mentor profile avatar_url
            if (user.role === 'mentor' || user.role === 'Mentor') {
                // Delete old avatar if exists
                const mentorProfile = await Mentor.getByUserId(userId);
                if (mentorProfile && mentorProfile.avatar_url) {
                    const oldFilePath = path.join(__dirname, '..', mentorProfile.avatar_url);
                    try {
                        await fs.unlink(oldFilePath);
                    } catch (err) {
                        console.error('Error deleting old avatar:', err);
                        // Continue even if deletion fails
                    }
                }

                await Mentor.upsertProfile(userId, { avatar_url: fileUrl });
            } else {
                // For mentees, store avatar_url in users table
                // Delete old avatar if exists
                if (user.avatar_url) {
                    const oldFilePath = path.join(__dirname, '..', user.avatar_url);
                    try {
                        await fs.unlink(oldFilePath);
                    } catch (err) {
                        console.error('Error deleting old avatar:', err);
                        // Continue even if deletion fails
                    }
                }

                await User.updateUser(userId, { avatar_url: fileUrl });
            }

            res.status(200).json({ 
                message: 'Profile picture uploaded successfully',
                avatar_url: fileUrl 
            });
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            res.status(500).json({ message: 'Server error uploading profile picture' });
        }
    }
};

export default profileController;
