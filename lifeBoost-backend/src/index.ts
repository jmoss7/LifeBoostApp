import express from 'express';
import dotenv from 'dotenv';
import prisma from './config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './authMiddleware';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Lifeboost!');
});

// example using middleware to verify logged in user
app.get('/protected', authenticateToken, async (req, res) => {
    const userId = req.body.userId; // comes from the token

    res.json({ message: `Hello, user ${userId}` });
});

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        res.json({ id: user.id, email: user.email });
    } catch (error) {
        console.error("Error registering new user:", error);
        res.status(500).json({ error: 'Failed to register new user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

app.post('/events', authenticateToken, async (req, res) => {
    try {
        const { title, required, duration, startTime} = req.body;
        const userId = req.body.userId; // Extract from token

        // Calculate end time based on duration
        const endTime = new Date(Date.now() + duration*60000);

        const event = await prisma.event.create({
            data: { title, required, duration, startTime, endTime, userId }
        });

        res.json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Get all events for logged-in user
app.get('/events', authenticateToken, async (req, res) => {
    try {
        const userId = req.body.userId;

        const events = await prisma.event.findMany({
            where: { userId },
            orderBy: { startTime: 'asc' }
        });

        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Delete an event
app.delete('/events/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.event.delete({ where: { id }});

        res.json({ message: 'Event deleted' });
    } catch (error) {
        console.error('Error deleting event: ', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});