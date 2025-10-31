import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoGrid from '@components/VideoGrid/VideoGrid';
import ControlPanel from '@components/ControlPanel/ControlPanel';
import { useStudioStore } from '@store/useStudioStore';
import webrtcService from '@services/webrtc.service';
import socketService from '@services/socket.service';
import apiService from '@services/api.service';
import { Participant } from '@types/index';

export default function StudioPage() {
  const { broadcastId } = useParams<{ broadcastId: string }>();
  const navigate = useNavigate();
  const { broadcast, participants, setBroadcast, addParticipant, removeParticipant, setLocalStream } = useStudioStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeStudio();

    return () => {
      cleanup();
    };
  }, [broadcastId]);

  const initializeStudio = async () => {
    try {
      if (!broadcastId) {
        throw new Error('Broadcast ID not found');
      }

      // 1. Загружаем информацию о broadcast
      const response = await apiService.getBroadcast(broadcastId);
      if (response.success && response.data) {
        setBroadcast(response.data);
      } else {
        throw new Error('Failed to load broadcast');
      }

      // 2. Получаем локальный медиа стрим
      const stream = await webrtcService.getUserMedia();
      setLocalStream(stream);

      // 3. Добавляем себя как участника
      const localParticipant: Participant = {
        id: 'local-' + Date.now(),
        name: 'You',
        role: 'host',
        audioEnabled: true,
        videoEnabled: true,
        screenSharing: false,
        handRaised: false,
        joinedAt: new Date(),
        stream: stream,
      };
      addParticipant(localParticipant);

      // 4. Подключаемся к signaling серверу
      await socketService.connect(broadcastId, 'current-user-id');
      socketService.joinBroadcast(broadcastId, { name: 'You', role: 'host' });

      // 5. Подписываемся на события
      setupSocketListeners();

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize studio:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Новый участник присоединился
    socketService.on('participant-joined', (data: any) => {
      console.log('Participant joined:', data);
      const newParticipant: Participant = {
        id: data.id,
        name: data.name,
        role: data.role || 'guest',
        audioEnabled: data.audioEnabled ?? true,
        videoEnabled: data.videoEnabled ?? true,
        screenSharing: false,
        handRaised: false,
        joinedAt: new Date(),
      };
      addParticipant(newParticipant);
    });

    // Участник покинул комнату
    socketService.on('participant-left', (data: any) => {
      console.log('Participant left:', data);
      removeParticipant(data.id);
    });

    // Обновление статуса участника
    socketService.on('participant-status-updated', (data: any) => {
      console.log('Participant status updated:', data);
      // Update participant status in store
    });

    // Получен WebRTC offer
    socketService.on('webrtc-offer', async (data: any) => {
      console.log('Received WebRTC offer:', data);
      // Handle WebRTC offer
    });

    // Получен WebRTC answer
    socketService.on('webrtc-answer', async (data: any) => {
      console.log('Received WebRTC answer:', data);
      // Handle WebRTC answer
    });

    // Получен ICE candidate
    socketService.on('ice-candidate', async (data: any) => {
      console.log('Received ICE candidate:', data);
      // Handle ICE candidate
    });
  };

  const cleanup = () => {
    // Останавливаем локальный стрим
    const localStream = useStudioStore.getState().localStream;
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Отключаемся от WebRTC
    webrtcService.disconnect();

    // Отключаемся от signaling сервера
    socketService.disconnect();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-studio-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Загрузка студии...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-studio-darker flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Ошибка: {error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all"
          >
            Вернуться к панели управления
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-studio-darker">
      {/* Header */}
      <header className="bg-studio-dark border-b border-studio-accent px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">{broadcast?.title || 'Новая трансляция'}</h1>
          <p className="text-gray-400 text-sm">{broadcast?.description}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Выйти из студии
        </button>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 overflow-hidden">
        <VideoGrid participants={participants} />
      </div>

      {/* Control Panel */}
      <ControlPanel />
    </div>
  );
}



