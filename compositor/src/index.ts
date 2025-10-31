import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

interface CompositionJob {
  id: string;
  inputs: string[];
  layout: 'grid' | 'spotlight' | 'sidebar';
  output: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const jobs: Map<string, CompositionJob> = new Map();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start composition
app.post('/api/compose/start', (req, res) => {
  const { broadcastId, inputs, layout, destinations } = req.body;
  
  const jobId = `job-${Date.now()}`;
  
  const job: CompositionJob = {
    id: jobId,
    inputs,
    layout: layout || 'grid',
    output: `rtmp://localhost:1935/live/${broadcastId}`,
    status: 'pending',
  };
  
  jobs.set(jobId, job);
  
  // Start FFmpeg composition
  startComposition(job);
  
  res.json({
    success: true,
    data: { jobId },
  });
});

// Stop composition
app.post('/api/compose/stop', (req, res) => {
  const { jobId } = req.body;
  
  const job = jobs.get(jobId);
  if (job) {
    // Stop FFmpeg process
    jobs.delete(jobId);
  }
  
  res.json({
    success: true,
    message: 'Composition stopped',
  });
});

// Get job status
app.get('/api/compose/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found',
    });
  }
  
  res.json({
    success: true,
    data: job,
  });
});

function startComposition(job: CompositionJob) {
  console.log(`Starting composition job: ${job.id}`);
  
  job.status = 'processing';
  
  // Example FFmpeg command for grid layout
  // This is a simplified version - real implementation would be more complex
  
  const command = ffmpeg();
  
  // Add inputs
  job.inputs.forEach(input => {
    command.input(input);
  });
  
  // Apply layout filter based on layout type
  let filterComplex = '';
  
  switch (job.layout) {
    case 'grid':
      // 2x2 grid layout
      filterComplex = `
        [0:v]scale=640:360[v0];
        [1:v]scale=640:360[v1];
        [2:v]scale=640:360[v2];
        [3:v]scale=640:360[v3];
        [v0][v1]hstack[top];
        [v2][v3]hstack[bottom];
        [top][bottom]vstack[out]
      `;
      break;
      
    case 'spotlight':
      // Main speaker + small windows
      filterComplex = `
        [0:v]scale=1280:720[main];
        [1:v]scale=320:180[small];
        [main][small]overlay=W-w-10:H-h-10[out]
      `;
      break;
      
    case 'sidebar':
      // Sidebar layout
      filterComplex = `
        [0:v]scale=960:720[main];
        [1:v]scale=320:360[side1];
        [2:v]scale=320:360[side2];
        [side1][side2]vstack[sidebar];
        [main][sidebar]hstack[out]
      `;
      break;
  }
  
  command
    .complexFilter(filterComplex.trim())
    .outputOptions([
      '-map', '[out]',
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-b:v', '2500k',
      '-maxrate', '2500k',
      '-bufsize', '5000k',
      '-g', '60',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-ar', '44100',
      '-f', 'flv',
    ])
    .output(job.output)
    .on('start', (commandLine) => {
      console.log('FFmpeg started:', commandLine);
    })
    .on('progress', (progress) => {
      console.log('Processing: ' + progress.percent + '% done');
    })
    .on('end', () => {
      console.log('Composition finished');
      job.status = 'completed';
    })
    .on('error', (err) => {
      console.error('Composition error:', err);
      job.status = 'failed';
    })
    .run();
}

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`✅ Compositor service running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});



