import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as mediasoup from 'mediasoup';
import { Worker, Router } from 'mediasoup/node/lib/types';
import { config } from './config/mediasoup';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let worker: Worker;
let router: Router;

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    worker: worker ? 'running' : 'not initialized',
  });
});

// Get router RTP capabilities
app.get('/router/capabilities', (req, res) => {
  if (!router) {
    return res.status(500).json({ error: 'Router not initialized' });
  }

  res.json({
    rtpCapabilities: router.rtpCapabilities,
  });
});

// Create WebRTC transport
app.post('/transport/create', async (req, res) => {
  try {
    const { type } = req.body; // 'send' or 'recv'

    if (!router) {
      return res.status(500).json({ error: 'Router not initialized' });
    }

    const transport = await router.createWebRtcTransport({
      listenIps: [
        {
          ip: '0.0.0.0',
          announcedIp: process.env.ANNOUNCED_IP || '127.0.0.1',
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    res.json({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    });
  } catch (error) {
    console.error('Create transport error:', error);
    res.status(500).json({ error: 'Failed to create transport' });
  }
});

// Connect transport
app.post('/transport/connect', async (req, res) => {
  try {
    const { transportId, dtlsParameters } = req.body;

    // In a real implementation, you would store transports and retrieve them
    // For this example, we'll just acknowledge the connection
    
    res.json({ success: true });
  } catch (error) {
    console.error('Connect transport error:', error);
    res.status(500).json({ error: 'Failed to connect transport' });
  }
});

// Produce media
app.post('/transport/produce', async (req, res) => {
  try {
    const { transportId, kind, rtpParameters } = req.body;

    // In a real implementation, you would:
    // 1. Get the transport by ID
    // 2. Create a producer
    // 3. Store the producer
    
    // For now, return a mock producer ID
    res.json({
      id: `producer-${Date.now()}`,
    });
  } catch (error) {
    console.error('Produce error:', error);
    res.status(500).json({ error: 'Failed to produce' });
  }
});

// Consume media
app.post('/transport/consume', async (req, res) => {
  try {
    const { transportId, producerId, rtpCapabilities } = req.body;

    // In a real implementation, you would:
    // 1. Get the transport by ID
    // 2. Get the producer by ID
    // 3. Create a consumer
    // 4. Store the consumer
    
    res.json({
      id: `consumer-${Date.now()}`,
      producerId,
      kind: 'video',
      rtpParameters: {},
    });
  } catch (error) {
    console.error('Consume error:', error);
    res.status(500).json({ error: 'Failed to consume' });
  }
});

async function initializeMediasoup() {
  try {
    // Create Mediasoup worker
    worker = await mediasoup.createWorker(config.worker);

    worker.on('died', () => {
      console.error('⚠️ Mediasoup worker died, exiting...');
      process.exit(1);
    });

    // Create router
    router = await worker.createRouter({
      mediaCodecs: config.router.mediaCodecs,
    });

    console.log('✅ Mediasoup initialized');
    console.log(`   Worker PID: ${worker.pid}`);
    console.log(`   Router ID: ${router.id}`);
  } catch (error) {
    console.error('❌ Failed to initialize Mediasoup:', error);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 6000;

initializeMediasoup().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Media server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 http://localhost:${PORT}`);
  });
});



