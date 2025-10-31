import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Video, Calendar, Download, Trash2 } from 'lucide-react';
import apiService from '@services/api.service';
import { Broadcast } from '@types/index';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBroadcasts();
  }, []);

  const loadBroadcasts = async () => {
    try {
      const response = await apiService.getBroadcasts();
      if (response.success && response.data) {
        setBroadcasts(response.data);
      }
    } catch (error) {
      console.error('Failed to load broadcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewBroadcast = async () => {
    try {
      const response = await apiService.createBroadcast({
        title: 'Новая трансляция',
        description: '',
        status: 'scheduled',
        settings: {
          layoutType: 'grid',
          maxParticipants: 10,
          enableChat: true,
          enableRecording: true,
          enableVirtualBackground: false,
          overlays: [],
        },
        destinations: [],
      });

      if (response.success && response.data) {
        navigate(`/studio/${response.data.id}`);
      }
    } catch (error) {
      console.error('Failed to create broadcast:', error);
    }
  };

  const deleteBroadcast = async (id: string) => {
    if (!confirm('Удалить эту трансляцию?')) return;

    try {
      await apiService.deleteBroadcast(id);
      setBroadcasts(broadcasts.filter(b => b.id !== id));
    } catch (error) {
      console.error('Failed to delete broadcast:', error);
    }
  };

  return (
    <div className="min-h-screen bg-studio-darker">
      {/* Header */}
      <header className="bg-studio-dark border-b border-studio-accent">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-white">StreamYard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Главная
            </button>
            <button
              onClick={createNewBroadcast}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Создать трансляцию
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Мои трансляции</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Загрузка...</p>
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="text-center py-12 bg-studio-accent/50 rounded-xl border border-white/10">
            <Video className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              У вас пока нет трансляций
            </h3>
            <p className="text-gray-400 mb-6">
              Создайте свою первую трансляцию и начните стримить
            </p>
            <button
              onClick={createNewBroadcast}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Создать трансляцию
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {broadcasts.map((broadcast) => (
              <BroadcastCard
                key={broadcast.id}
                broadcast={broadcast}
                onDelete={() => deleteBroadcast(broadcast.id)}
                onEnter={() => navigate(`/studio/${broadcast.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface BroadcastCardProps {
  broadcast: Broadcast;
  onDelete: () => void;
  onEnter: () => void;
}

function BroadcastCard({ broadcast, onDelete, onEnter }: BroadcastCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-600';
      case 'scheduled': return 'bg-blue-600';
      case 'ended': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return 'В эфире';
      case 'scheduled': return 'Запланирована';
      case 'ended': return 'Завершена';
      default: return status;
    }
  };

  return (
    <div className="bg-studio-accent/50 rounded-xl border border-white/10 overflow-hidden hover:border-primary-500/50 transition-all group">
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-primary-600/20 to-primary-800/20 relative">
        {broadcast.thumbnailUrl ? (
          <img src={broadcast.thumbnailUrl} alt={broadcast.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Video className="w-16 h-16 text-gray-500" />
          </div>
        )}
        <div className={`absolute top-3 left-3 px-3 py-1 ${getStatusColor(broadcast.status)} text-white text-sm font-medium rounded-full`}>
          {getStatusText(broadcast.status)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2">{broadcast.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {broadcast.description || 'Нет описания'}
        </p>

        {broadcast.startTime && (
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Calendar className="w-4 h-4" />
            {new Date(broadcast.startTime).toLocaleDateString('ru-RU')}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEnter}
            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all text-sm font-medium"
          >
            Открыть студию
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all"
            title="Удалить"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}



