import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

export class UploadController {
  async uploadFile(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      res.json({
        success: true,
        data: {
          url: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload file',
      });
    }
  }
}



