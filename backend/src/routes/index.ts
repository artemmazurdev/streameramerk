import { Router } from 'express';
import authRoutes from './auth.routes';
import broadcastRoutes from './broadcast.routes';
import recordingRoutes from './recording.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/broadcasts', broadcastRoutes);
router.use('/recordings', recordingRoutes);
router.use('/upload', uploadRoutes);

export default router;



