import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          subscriptionTier: true,
          createdAt: true,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        success: true,
        data: { user, token },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to register user',
      });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: { user: userWithoutPassword, token },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to login',
      });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          subscriptionTier: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user',
      });
    }
  }

  async logout(req: AuthRequest, res: Response) {
    // In a stateless JWT setup, logout is handled client-side
    // Here we could implement token blacklisting if needed
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name, avatar } = req.body;

      const user = await prisma.user.update({
        where: { id: req.userId },
        data: {
          ...(name && { name }),
          ...(avatar && { avatar }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          subscriptionTier: true,
          createdAt: true,
        },
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
      });
    }
  }
}



