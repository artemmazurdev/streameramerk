import NodeMediaServer from 'node-media-server';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// RTMP Server configuration
const nmsConfig = {
  rtmp: {
    port: parseInt(process.env.RTMP_PORT || '1935'),
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: parseInt(process.env.HTTP_PORT || '8888'),
    allow_origin: '*',
    mediaroot: './media',
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
      },
    ],
  },
};

const nms = new NodeMediaServer(nmsConfig);

// Event handlers
nms.on('preConnect', (id: string, args: any) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('postConnect', (id: string, args: any) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id: string, args: any) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id: string, StreamPath: string, args: any) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Here you can validate stream keys
  // const streamKey = args.key;
  // Validate against database
});

nms.on('postPublish', (id: string, StreamPath: string, args: any) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Start relaying to multiple destinations
  // This is where multistreaming logic would go
});

nms.on('donePublish', (id: string, StreamPath: string, args: any) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rtmpPort: nmsConfig.rtmp.port,
    httpPort: nmsConfig.http.port,
  });
});

// Get stream stats
app.get('/api/streams', (req, res) => {
  const streams = nms.getSession();
  res.json({
    success: true,
    data: streams,
  });
});

// Start relay to destination
app.post('/api/relay/start', (req, res) => {
  const { sourceStream, destinations } = req.body;
  
  // Implementation for starting relay to multiple RTMP destinations
  // This would use FFmpeg to relay the stream
  
  res.json({
    success: true,
    message: 'Relay started',
  });
});

// Stop relay
app.post('/api/relay/stop', (req, res) => {
  const { streamId } = req.body;
  
  res.json({
    success: true,
    message: 'Relay stopped',
  });
});

// Start servers
nms.run();

const HTTP_PORT = process.env.API_PORT || 8889;
app.listen(HTTP_PORT, () => {
  console.log(`✅ RTMP Relay server running`);
  console.log(`   RTMP Port: ${nmsConfig.rtmp.port}`);
  console.log(`   HTTP Port: ${nmsConfig.http.port}`);
  console.log(`   API Port: ${HTTP_PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});



