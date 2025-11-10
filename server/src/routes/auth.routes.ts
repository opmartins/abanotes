import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import prisma from '../db/client';
import crypto from 'crypto';

const router = Router();
// Using shared prisma instance from db/client
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Optional: explicit GET handler to clarify correct method
router.get('/login', (_req, res) => {
    res.status(405).json({ message: 'Use POST /api/auth/login with { email, password }' });
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Buscar usuário
        const user = await prisma.user.findUnique({ where: { email } }) as any;

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

    if (!user.active) {
            return res.status(403).json({ message: 'Usuário inativo. Contate o administrador.' });
        }

        // Verificar senha
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Gerar token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
});

// Obter perfil do usuário logado
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } }) as any;

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
});

// Listar todos os usuários (apenas admin)
router.get('/users', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({}) as any[];

        res.json(users);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro ao listar usuários' });
    }
});

// Criar novo usuário (apenas admin)
router.post('/users', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Validações
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
        }

        // Verificar se email já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const user = await prisma.user.create({
            data: ({
                name,
                email,
                password: hashedPassword,
                role: role === 'ADMIN' ? 'ADMIN' : 'USER'
            } as any)
        }) as any;

        res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
});

// Atualizar usuário (apenas admin)
router.put('/users/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, role, active, password } = req.body;

        const updateData: any = {};
        
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (typeof active === 'boolean') updateData.active = active;
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData
        }) as any;

        res.json(user);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
});

// Deletar usuário (apenas admin)
router.delete('/users/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        // Não permitir deletar a si mesmo
        if (userId === req.user!.id) {
            return res.status(400).json({ message: 'Você não pode deletar sua própria conta' });
        }

        // Verificar se é o último admin
        const user = await prisma.user.findUnique({ where: { id: userId } }) as any;

        if (user?.role === 'ADMIN') {
            const admins = await prisma.user.findMany({}) as any[];
            const adminCount = admins.filter(u => u.role === 'ADMIN' && u.active).length;

            if (adminCount <= 1) {
                return res.status(400).json({ message: 'Não é possível deletar o último administrador' });
            }
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
});

// Alterar própria senha
router.put('/change-password', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Nova senha deve ter no mínimo 6 caracteres' });
        }

        // Buscar usuário
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } }) as any;

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar senha atual
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Senha atual incorreta' });
        }

        // Atualizar senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: req.user!.id },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ message: 'Erro ao alterar senha' });
    }
});

// Solicitar reset de senha (gera token) - público
router.post('/password/forgot', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email é obrigatório' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Para não revelar se existe, retorna sucesso genérico
            return res.json({ message: 'Se o email existir, enviaremos instruções de reset.' });
        }

        // Gerar token seguro
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

    await (prisma as any).passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt
            }
        });

        // Em produção enviar email; em dev apenas logar
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${token}`;
        console.log('[PasswordReset] Link:', resetLink);

        return res.json({ message: 'Se o email existir, enviaremos instruções de reset.' });
    } catch (error) {
        console.error('Erro ao solicitar reset de senha:', error);
        res.status(500).json({ message: 'Erro ao solicitar reset de senha' });
    }
});

// Resetar senha com token - público
router.post('/password/reset', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
        }

    const reset = await (prisma as any).passwordResetToken.findUnique({ where: { token } });
        if (!reset) {
            return res.status(400).json({ message: 'Token inválido' });
        }
        if (reset.usedAt) {
            return res.status(400).json({ message: 'Token já utilizado' });
        }
        if (reset.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Token expirado' });
        }

        // Atualizar senha do usuário
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: reset.userId },
            data: { password: hashedPassword }
        });

        // Marcar token como usado
    await (prisma as any).passwordResetToken.update({
            where: { id: reset.id },
            data: { usedAt: new Date() }
        });

        return res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error('Erro ao resetar senha:', error);
        res.status(500).json({ message: 'Erro ao resetar senha' });
    }
});

export default router;