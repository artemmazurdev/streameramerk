import { Router } from 'express';
import { BroadcastController } from '../controllers/broadcast.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const broadcastController = new BroadcastController();

// All broadcast routes require authentication
router.use(authMiddleware);

router.get('/', broadcastController.getBroadcasts);
router.post('/', broadcastController.createBroadcast);
router.get('/:id', broadcastController.getBroadcast);
router.patch('/:id', broadcastController.updateBroadcast);
router.delete('/:id', broadcastController.deleteBroadcast);

// Broadcast actions
router.post('/:id/start', broadcastController.startBroadcast);
router.post('/:id/end', broadcastController.endBroadcast);

// Destinations
router.post('/:id/destinations', broadcastController.addDestination);
router.delete('/:id/destinations/:destinationId', broadcastController.removeDestination);
router.post('/:id/destinations/:destinationId/test', broadcastController.testDestination);

// Analytics
router.get('/:id/analytics', broadcastController.getAnalytics);

export default router;



