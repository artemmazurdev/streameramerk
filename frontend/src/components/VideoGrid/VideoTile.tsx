import { useEffect, useRef, useState } from 'react';
import { Participant } from '@types/index';
import { Mic, MicOff, Video, VideoOff, Monitor, Hand } from 'lucide-react';

interface VideoTileProps {
  participant: Participant;
  isSpotlight?: boolean;
}

export default function VideoTile({ participant, isSpotlight = false }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
      setIsVideoLoaded(true);
    }
  }, [participant.stream]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`relative bg-studio-accent rounded-lg overflow-hidden ${
        isSpotlight ? 'col-span-full row-span-full' : ''
      }`}
    >
      {/* Video Element */}
      {participant.videoEnabled && participant.stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.role === 'host'} // Мутим свое собственное видео
          className={`w-full h-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : (
        // Avatar placeholder
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary-700 flex items-center justify-center text-4xl font-bold text-white">
              {getInitials(participant.name)}
            </div>
          )}
        </div>
      )}

      {/* Participant Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{participant.name}</span>
            {participant.role === 'host' && (
              <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded">
                Host
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {participant.screenSharing && (
              <Monitor className="w-4 h-4 text-green-400" />
            )}
            
            {participant.handRaised && (
              <Hand className="w-4 h-4 text-yellow-400 animate-bounce" />
            )}

            {participant.audioEnabled ? (
              <Mic className="w-4 h-4 text-white" />
            ) : (
              <MicOff className="w-4 h-4 text-red-400" />
            )}

            {!participant.videoEnabled && (
              <VideoOff className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>
      </div>

      {/* Speaking Indicator */}
      {participant.audioEnabled && (
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-green-400 rounded-lg pointer-events-none opacity-0 transition-opacity duration-200 speaking-indicator" />
      )}
    </div>
  );
}



