import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// import initDB from './config/initDB.js'; // Removed: We are using db.js directly
import './config/db.js'; // Import db.js to ensure connection is established
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import mentorRoutes from './routes/mentorRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express(); // Define app outside startserver for potential testing/modularity

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
// Serve uploads for attachments
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Dev-friendly CSP: allow connect-src to localhost for DevTools/extensions
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' http://localhost:5000 ws://localhost:5000");
        next();
    });
}

// Enable preflight for all routes with same settings
app.options('*', cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/conversations', conversationRoutes);
import sessionRoutes from './routes/sessionRoutes.js';
app.use('/api/sessions', sessionRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'MentorChain Backend API is running!' });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// attach io to app so controllers can access
app.set('io', io);

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('join:conversation', ({ conversationId }) => {
        socket.join(`conversation_${conversationId}`);
    });

    socket.on('leave:conversation', ({ conversationId }) => {
        socket.leave(`conversation_${conversationId}`);
    });

    socket.on('message:send', async ({ conversationId, content, senderId }) => {
        // For security, we should validate sender and session; simple version here
        // Save message using model
        try {
            const MessageModel = (await import('./models/messageModel.js')).default;
            const msg = await MessageModel.createMessage(conversationId, senderId, content);
            io.to(`conversation_${conversationId}`).emit('message:new', msg);
        } catch (err) {
            console.error('socket message send failed', err);
        }
    });
});

const startServer = async () => {
    try {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Start calendar sync job if configured (runs every 15 minutes)
        try {
            const calendarSyncJob = (await import('./jobs/calendarSyncJob.js')).default;
            const intervalMs = parseInt(process.env.CALENDAR_SYNC_INTERVAL_MIN || '15', 10) * 60 * 1000;
            setInterval(() => {
                calendarSyncJob.runAll();
            }, intervalMs);
            console.log(`Calendar sync job scheduled every ${intervalMs / 60000} minutes`);
        } catch (err) {
            console.warn('Calendar sync job not started (missing config or dependency):', err.message);
        }

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit the process with an error code
    }
};

startServer();

export default server;