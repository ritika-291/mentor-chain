import { google } from 'googleapis';
import CalendarIntegration from '../models/calendarIntegrationModel.js';
import CalendarEvents from '../models/calendarEventsModel.js';
import dotenv from 'dotenv';

dotenv.config();

function getOAuthClient() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Missing Google OAuth config; set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI in .env');
    }

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

async function syncSingleIntegration(integration) {
    try {
        if (!integration || integration.provider !== 'google' || !integration.access_token) return;

        const oauth2Client = getOAuthClient();
        oauth2Client.setCredentials({
            access_token: integration.access_token,
            refresh_token: integration.refresh_token,
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Fetch events for next 7 days
        const now = new Date();
        const timeMin = now.toISOString();
        const timeMax = new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString();

        const res = await calendar.events.list({ calendarId: 'primary', timeMin, timeMax, singleEvents: true, orderBy: 'startTime' });
        const events = res.data.items || [];

        for (const ev of events) {
            const providerEventId = ev.id;
            const startTime = ev.start?.dateTime || ev.start?.date || null;
            const endTime = ev.end?.dateTime || ev.end?.date || null;
            await CalendarEvents.upsertEvent(integration.user_id, 'google', providerEventId, startTime ? new Date(startTime) : null, endTime ? new Date(endTime) : null, ev);
        }

        console.log(`Synced ${events.length} events for user ${integration.user_id}`);
    } catch (err) {
        console.error('Failed to sync calendar integration:', err);
    }
}

const calendarSyncJob = {
    // Run an entire sync pass
    async runAll() {
        try {
            const integrations = await CalendarIntegration.listAll ? await CalendarIntegration.listAll() : null;
            if (!integrations) return;
            for (const integration of integrations) {
                await syncSingleIntegration(integration);
            }
        } catch (err) {
            console.error('Error running calendar sync job:', err);
        }
    }
};

export default calendarSyncJob;