import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'ADMIN' | 'USER';
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado' });
        }

        req.user = decoded as any;
        next();
    });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
    }

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }

    next();
};