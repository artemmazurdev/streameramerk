import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoomManager } from './services/roomManager';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', connections: io.engine.clientsCount });
});

const roomManager = new RoomManager();

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  const { broadcastId, userId } = socket.handshake.auth;

  // Join broadcast room
  socket.on('join-broadcast', (data) => {
    const { broadcastId, userData } = data;
    socket.join(broadcastId);
    
    roomManager.addParticipant(broadcastId, {
      socketId: socket.id,
      userId: userData.userId || socket.id,
      name: userData.name,
      role: userData.role || 'guest',
    });

    // Notify others in the room
    socket.to(broadcastId).emit('participant-joined', {
      id: socket.id,
      name: userData.name,
      role: userData.role,
    });

    // Send current participants to the new user
    const participants = roomManager.getParticipants(broadcastId);
    socket.emit('room-participants', participants);

    console.log(`👤 User ${socket.id} joined broadcast ${broadcastId}`);
  });

  // Leave broadcast room
  socket.on('leave-broadcast', (data) => {
    const { broadcastId } = data;
    socket.leave(broadcastId);
    
    roomManager.removeParticipant(broadcastId, socket.id);
    
    socket.to(broadcastId).emit('participant-left', {
      id: socket.id,
    });

    console.log(`👋 User ${socket.id} left broadcast ${broadcastId}`);
  });

  // WebRTC Signaling
  socket.on('webrtc-offer', (data) => {
    const { targetId, offer } = data;
    io.to(targetId).emit('webrtc-offer', {
      fromId: socket.id,
      offer,
    });
  });

  socket.on('webrtc-answer', (data) => {
    const { targetId, answer } = data;
    io.to(targetId).emit('webrtc-answer', {
      fromId: socket.id,
      answer,
    });
  });

  socket.on('ice-candidate', (data) => {
    const { targetId, candidate } = data;
    io.to(targetId).emit('ice-candidate', {
      fromId: socket.id,
      candidate,
    });
  });

  // Broadcast events
  socket.on('start-broadcast', (data) => {
    const { broadcastId } = data;
    io.to(broadcastId).emit('broadcast-started', {
      broadcastId,
      timestamp: new Date(),
    });
  });

  socket.on('end-broadcast', (data) => {
    const { broadcastId } = data;
    io.to(broadcastId).emit('broadcast-ended', {
      broadcastId,
      timestamp: new Date(),
    });
  });

  // Chat messages
  socket.on('chat-message', (data) => {
    const { broadcastId, message } = data;
    io.to(broadcastId).emit('chat-message', {
      id: socket.id,
      message,
      timestamp: new Date(),
    });
  });

  // Participant status updates
  socket.on('participant-status', (data) => {
    const { broadcastId, audioEnabled, videoEnabled, screenSharing } = data;
    
    roomManager.updateParticipant(broadcastId, socket.id, {
      audioEnabled,
      videoEnabled,
      screenSharing,
    });

    socket.to(broadcastId).emit('participant-status-updated', {
      id: socket.id,
      audioEnabled,
      videoEnabled,
      screenSharing,
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    
    // Remove from all rooms
    const rooms = roomManager.removeParticipantFromAll(socket.id);
    
    rooms.forEach((broadcastId) => {
      socket.to(broadcastId).emit('participant-left', {
        id: socket.id,
      });
    });
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`✅ Signaling server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 ws://localhost:${PORT}`);
});



