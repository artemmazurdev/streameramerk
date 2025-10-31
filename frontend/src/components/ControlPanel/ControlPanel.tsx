import { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  Phone,
  PhoneOff,
  Circle,
  Square,
  Settings,
  Users,
  MessageSquare,
  Layout
} from 'lucide-react';
import { useStudioStore } from '@store/useStudioStore';

export default function ControlPanel() {
  const {
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    isRecording,
    isLive,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    startRecording,
    stopRecording,
    goLive,
    endBroadcast,
  } = useStudioStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleGoLive = () => {
    if (isLive) {
      if (confirm('Вы уверены, что хотите завершить трансляцию?')) {
        endBroadcast();
      }
    } else {
      goLive();
    }
  };

  const handleRecording = () => {
    if (isRecording) {
      if (confirm('Остановить запись?')) {
        stopRecording();
      }
    } else {
      startRecording();
    }
  };

  return (
    <div className="bg-studio-dark border-t border-studio-accent px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Controls - Media */}
        <div className="flex items-center gap-3">
          {/* Microphone */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all ${
              isAudioEnabled
                ? 'bg-studio-accent hover:bg-studio-accent/80 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isAudioEnabled ? 'Выключить микрофон' : 'Включить микрофон'}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all ${
              isVideoEnabled
                ? 'bg-studio-accent hover:bg-studio-accent/80 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isVideoEnabled ? 'Выключить камеру' : 'Включить камеру'}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-all ${
              isScreenSharing
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-studio-accent hover:bg-studio-accent/80 text-white'
            }`}
            title={isScreenSharing ? 'Остановить демонстрацию' : 'Демонстрация экрана'}
          >
            {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </button>

          <div className="w-px h-8 bg-studio-accent mx-2" />

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-4 rounded-full bg-studio-accent hover:bg-studio-accent/80 text-white transition-all"
            title="Настройки"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Center Controls - Broadcast */}
        <div className="flex items-center gap-3">
          {/* Recording */}
          <button
            onClick={handleRecording}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-studio-accent hover:bg-studio-accent/80 text-white'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-5 h-5" />
                Остановить запись
              </>
            ) : (
              <>
                <Circle className="w-5 h-5" />
                Записать
              </>
            )}
          </button>

          {/* Go Live / End */}
          <button
            onClick={handleGoLive}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition-all flex items-center gap-2 ${
              isLive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/50'
            }`}
          >
            {isLive ? (
              <>
                <PhoneOff className="w-6 h-6" />
                Завершить
                <span className="ml-2 w-3 h-3 bg-white rounded-full recording-pulse" />
              </>
            ) : (
              <>
                <Phone className="w-6 h-6" />
                Начать трансляцию
              </>
            )}
          </button>
        </div>

        {/* Right Controls - UI */}
        <div className="flex items-center gap-3">
          {/* Layout */}
          <button
            className="p-4 rounded-full bg-studio-accent hover:bg-studio-accent/80 text-white transition-all"
            title="Изменить макет"
          >
            <Layout className="w-5 h-5" />
          </button>

          {/* Participants */}
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-4 rounded-full bg-studio-accent hover:bg-studio-accent/80 text-white transition-all"
            title="Участники"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Chat */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-4 rounded-full bg-studio-accent hover:bg-studio-accent/80 text-white transition-all"
            title="Чат"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {isLive && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600 rounded-full">
            <span className="w-2 h-2 bg-red-600 rounded-full recording-pulse" />
            <span className="text-red-400 font-medium text-sm">В ЭФИРЕ</span>
          </div>
        </div>
      )}
    </div>
  );
}



