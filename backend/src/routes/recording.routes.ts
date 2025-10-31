import { Router } from 'express';
import { RecordingController } from '../controllers/recording.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const recordingController = new RecordingController();

// All recording routes require authentication
router.use(authMiddleware);

router.get('/', recordingController.getRecordings);
router.get('/:id', recordingController.getRecording);
router.delete('/:id', recordingController.deleteRecording);

export default router;



