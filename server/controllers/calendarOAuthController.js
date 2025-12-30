import { google } from 'googleapis';
import dotenv from 'dotenv';
import CalendarIntegration from '../models/calendarIntegrationModel.js';

dotenv.config();

function getOAuthClient() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI; // e.g. https://yourdomain.com/api/mentors/calendar/oauth/callback

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Missing Google OAuth config; set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI in .env');
    }

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

const calendarOAuthController = {
    // Returns an OAuth URL for mentor to visit
    async getAuthUrl(req, res) {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            if (isNaN(mentorId)) return res.status(400).json({ message: 'Invalid mentor id' });

            if (!req.user || req.user.id !== mentorId) return res.status(403).json({ message: 'Forbidden' });

            const oauth2Client = getOAuthClient();
            const scopes = [ 'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events' ];

            const url = oauth2Client.generateAuthUrl({
                access_type: 'offline', // request refresh token
                scope: scopes,
                prompt: 'consent',
                state: JSON.stringify({ userId: mentorId })
            });

            res.json({ url });
        } catch (err) {
            console.error('Error generating Google auth url:', err);
            res.status(500).json({ message: err.message });
        }
    },

    // OAuth callback endpoint (public) — exchanges code for tokens and stores them
    async oauthCallback(req, res) {
        try {
            const { code, state } = req.query;
            if (!code) return res.status(400).send('Missing code');
            if (!state) return res.status(400).send('Missing state');

            const parsed = JSON.parse(state);
            const userId = parseInt(parsed.userId, 10);
            if (isNaN(userId)) return res.status(400).send('Invalid state');

            const oauth2Client = getOAuthClient();
            const { tokens } = await oauth2Client.getToken(code);

            // Optionally, we can get the provider_user_id (Google sub) via people API or id_token
            const provider_user_id = (tokens.id_token) ? (new google.auth.OAuth2()).getTokenInfo ? null : null : null;

            // Save tokens to DB
            await CalendarIntegration.upsert(userId, {
                provider: 'google',
                provider_user_id: provider_user_id || null,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token || null,
                scope: tokens.scope || null,
                token_expires: tokens.expiry_date ? new Date(tokens.expiry_date) : null
            });

            // Redirect to a client page with success message (if CLIENT_URL is set)
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
            return res.redirect(`${clientUrl}/mentor/${userId}/settings?calendar_connected=1`);
        } catch (err) {
            console.error('OAuth callback error:', err);
            res.status(500).send('OAuth callback failed');
        }
    }
};

export default calendarOAuthController;