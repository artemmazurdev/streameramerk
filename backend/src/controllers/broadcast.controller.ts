import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export class BroadcastController {
  async getBroadcasts(req: AuthRequest, res: Response) {
    try {
      const broadcasts = await prisma.broadcast.findMany({
        where: { userId: req.userId },
        include: {
          destinations: true,
          _count: {
            select: { participants: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: broadcasts,
      });
    } catch (error) {
      console.error('Get broadcasts error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get broadcasts',
      });
    }
  }

  async createBroadcast(req: AuthRequest, res: Response) {
    try {
      const broadcast = await prisma.broadcast.create({
        data: {
          userId: req.userId!,
          title: req.body.title || 'Новая трансляция',
          description: req.body.description,
          status: 'scheduled',
          layoutType: req.body.settings?.layoutType || 'grid',
          maxParticipants: req.body.settings?.maxParticipants || 10,
          enableChat: req.body.settings?.enableChat ?? true,
          enableRecording: req.body.settings?.enableRecording ?? true,
          enableVirtualBackground: req.body.settings?.enableVirtualBackground ?? false,
          overlays: req.body.settings?.overlays || [],
        },
        include: {
          destinations: true,
        },
      });

      res.status(201).json({
        success: true,
        data: broadcast,
      });
    } catch (error) {
      console.error('Create broadcast error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create broadcast',
      });
    }
  }

  async getBroadcast(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const broadcast = await prisma.broadcast.findUnique({
        where: { id },
        include: {
          destinations: true,
          participants: true,
        },
      });

      if (!broadcast) {
        return res.status(404).json({
          success: false,
          error: 'Broadcast not found',
        });
      }

      // Check if user owns the broadcast
      if (broadcast.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
        });
      }

      res.json({
        success: true,
        data: broadcast,
      });
    } catch (error) {
      console.error('Get broadcast error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get broadcast',
      });
    }
  }

  async updateBroadcast(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const broadcast = await prisma.broadcast.findUnique({
        where: { id },
      });

      if (!broadcast) {
        return res.status(404).json({
          success: false,
          error: 'Broadcast not found',
        });
      }

      if (broadcast.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
        });
      }

      const updated = await prisma.broadcast.update({
        where: { id },
        data: {
          ...(req.body.title && { title: req.body.title }),
          ...(req.body.description !== undefined && { description: req.body.description }),
          ...(req.body.status && { status: req.body.status }),
        },
        include: {
          destinations: true,
        },
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      console.error('Update broadcast error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update broadcast',
      });
    }
  }

  async deleteBroadcast(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const broadcast = await prisma.broadcast.findUnique({
        where: { id },
      });

      if (!broadcast) {
        return res.status(404).json({
          success: false,
          error: 'Broadcast not found',
        });
      }

      if (broadcast.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
        });
      }

      await prisma.broadcast.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Broadcast deleted successfully',
      });
    } catch (error) {
      console.error('Delete broadcast error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete broadcast',
      });
    }
  }

  async startBroadcast(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const broadcast = await prisma.broadcast.update({
        where: { id },
        data: {
          status: 'live',
          startTime: new Date(),
        },
      });

      res.json({
        success: true,
        data: broadcast,
      });
    } catch (error) {
      console.error('Start broadcast error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start broadcast',
      });
    }
  }

  async endBroadcast(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const broadcast = await prisma.broadcast.update({
        where: { id },
        data: {
          status: 'ended',
          endTime: new Date(),
        },
      });

      res.json({
        success: true,
        data: broadcast,
      });
    } catch (error) {
      console.error('End broadcast error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to end broadcast',
      });
    }
  }

  async addDestination(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { platform, streamKey, rtmpUrl } = req.body;

      const destination = await prisma.destination.create({
        data: {
          broadcastId: id,
          platform,
          streamKey,
          rtmpUrl,
        },
      });

      res.status(201).json({
        success: true,
        data: destination,
      });
    } catch (error) {
      console.error('Add destination error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add destination',
      });
    }
  }

  async removeDestination(req: AuthRequest, res: Response) {
    try {
      const { destinationId } = req.params;

      await prisma.destination.delete({
        where: { id: destinationId },
      });

      res.json({
        success: true,
        message: 'Destination removed successfully',
      });
    } catch (error) {
      console.error('Remove destination error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove destination',
      });
    }
  }

  async testDestination(req: AuthRequest, res: Response) {
    try {
      // Implement RTMP connection test logic here
      res.json({
        success: true,
        data: { status: 'connected' },
      });
    } catch (error) {
      console.error('Test destination error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to test destination',
      });
    }
  }

  async getAnalytics(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Implement analytics logic here
      res.json({
        success: true,
        data: {
          broadcastId: id,
          viewerCount: 0,
          peakViewers: 0,
          averageWatchTime: 0,
        },
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get analytics',
      });
    }
  }
}



