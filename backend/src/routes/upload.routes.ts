import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadMiddleware } from '../middleware/upload.middleware';

const router = Router();
const uploadController = new UploadController();

// All upload routes require authentication
router.use(authMiddleware);

router.post('/', uploadMiddleware.single('file'), uploadController.uploadFile);

export default router;



