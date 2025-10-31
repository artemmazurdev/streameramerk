import { useEffect, useRef } from 'react';
import { Participant } from '@types/index';
import VideoTile from './VideoTile';
import { useStudioStore } from '@store/useStudioStore';

interface VideoGridProps {
  participants: Participant[];
  layout?: 'grid' | 'spotlight' | 'sidebar';
}

export default function VideoGrid({ participants, layout = 'grid' }: VideoGridProps) {
  const { currentLayout } = useStudioStore();
  const activeLayout = layout || currentLayout;

  const getGridClass = () => {
    const count = participants.length;
    
    if (activeLayout === 'spotlight') {
      return 'grid grid-cols-1';
    }
    
    if (activeLayout === 'sidebar') {
      return 'grid grid-cols-[1fr_300px] gap-4';
    }

    // Grid layout
    if (count === 1) return 'grid grid-cols-1';
    if (count === 2) return 'grid grid-cols-2';
    if (count <= 4) return 'grid grid-cols-2 grid-rows-2';
    if (count <= 6) return 'grid grid-cols-3 grid-rows-2';
    if (count <= 9) return 'grid grid-cols-3 grid-rows-3';
    return 'grid grid-cols-4 grid-rows-3';
  };

  return (
    <div className={`w-full h-full p-4 gap-4 ${getGridClass()}`}>
      {participants.map((participant, index) => (
        <VideoTile
          key={participant.id}
          participant={participant}
          isSpotlight={activeLayout === 'spotlight' && index === 0}
        />
      ))}
      
      {participants.length === 0 && (
        <div className="flex items-center justify-center h-full bg-studio-dark rounded-lg">
          <div className="text-center">
            <p className="text-gray-400 text-lg">Ожидание участников...</p>
            <p className="text-gray-500 text-sm mt-2">
              Пригласите участников или начните трансляцию
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



