import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const payload = jwt.verify(token, jwtSecret) as { userId: number};
        req.body.userId = payload.userId;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
}