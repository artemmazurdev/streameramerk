import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export class RecordingController {
  async getRecordings(req: AuthRequest, res: Response) {
    try {
      const recordings = await prisma.recording.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: recordings,
      });
    } catch (error) {
      console.error('Get recordings error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recordings',
      });
    }
  }

  async getRecording(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const recording = await prisma.recording.findUnique({
        where: { id },
      });

      if (!recording) {
        return res.status(404).json({
          success: false,
          error: 'Recording not found',
        });
      }

      if (recording.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
        });
      }

      res.json({
        success: true,
        data: recording,
      });
    } catch (error) {
      console.error('Get recording error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recording',
      });
    }
  }

  async deleteRecording(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const recording = await prisma.recording.findUnique({
        where: { id },
      });

      if (!recording) {
        return res.status(404).json({
          success: false,
          error: 'Recording not found',
        });
      }

      if (recording.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
        });
      }

      await prisma.recording.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Recording deleted successfully',
      });
    } catch (error) {
      console.error('Delete recording error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete recording',
      });
    }
  }
}



