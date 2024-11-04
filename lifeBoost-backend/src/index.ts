import express from 'express';
import dotenv from 'dotenv';
import prisma from './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Lifeboost!');
});

// Test route to create a user
app.post('/create-user', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: req.body.password,
            },
        });
        res.json(user);
    } catch (error) {
        //console.error("Error creating user:", error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});