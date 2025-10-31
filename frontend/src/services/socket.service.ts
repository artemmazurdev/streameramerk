import { io, Socket } from 'socket.io-client';

const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL || 'ws://localhost:5000';

type EventCallback = (...args: any[]) => void;

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(broadcastId: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(SIGNALING_URL, {
        transports: ['websocket'],
        auth: {
          broadcastId,
          userId,
        },
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to signaling server');
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Failed to connect to signaling server'));
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from signaling server:', reason);
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Присоединение к broadcast комнате
  joinBroadcast(broadcastId: string, userData: any) {
    this.emit('join-broadcast', { broadcastId, userData });
  }

  // Выход из broadcast комнаты
  leaveBroadcast(broadcastId: string) {
    this.emit('leave-broadcast', { broadcastId });
  }

  // Отправка SDP offer
  sendOffer(targetId: string, offer: RTCSessionDescriptionInit) {
    this.emit('webrtc-offer', { targetId, offer });
  }

  // Отправка SDP answer
  sendAnswer(targetId: string, answer: RTCSessionDescriptionInit) {
    this.emit('webrtc-answer', { targetId, answer });
  }

  // Отправка ICE candidate
  sendIceCandidate(targetId: string, candidate: RTCIceCandidateInit) {
    this.emit('ice-candidate', { targetId, candidate });
  }

  // Уведомление о начале трансляции
  startBroadcast(broadcastId: string) {
    this.emit('start-broadcast', { broadcastId });
  }

  // Уведомление о завершении трансляции
  endBroadcast(broadcastId: string) {
    this.emit('end-broadcast', { broadcastId });
  }

  // Отправка сообщения в чат
  sendChatMessage(broadcastId: string, message: string) {
    this.emit('chat-message', { broadcastId, message });
  }

  // Обновление статуса участника (микрофон, камера)
  updateParticipantStatus(status: { audioEnabled: boolean; videoEnabled: boolean; screenSharing: boolean }) {
    this.emit('participant-status', status);
  }

  // Подписка на события
  on(event: string, callback: EventCallback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Отписка от событий
  off(event: string, callback?: EventCallback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Отправка события
  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected');
    }
  }

  // Проверка подключения
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Получение ID сокета
  getId(): string | undefined {
    return this.socket?.id;
  }
}

export default new SocketService();



