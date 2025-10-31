import { useNavigate } from 'react-router-dom';
import { Video, Users, Globe, Zap, Shield, Cloud } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-studio-darker via-studio-dark to-studio-accent">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-white">StreamYard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-white hover:text-primary-400 transition-colors"
            >
              Вход
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all"
            >
              Регистрация
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-6xl font-bold text-white mb-6">
          Профессиональный стриминг
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
            прямо в браузере
          </span>
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Проводите прямые трансляции на YouTube, Facebook, Twitch и другие платформы
          одновременно. Без установки программ. Без сложных настроек.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-12 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-lg transition-all shadow-2xl shadow-primary-600/50 transform hover:scale-105"
        >
          Начать бесплатно
        </button>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-16">
          Все что нужно для стриминга
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="w-12 h-12" />}
            title="До 10 участников"
            description="Приглашайте гостей прямо по ссылке. Без установки программ."
          />
          <FeatureCard
            icon={<Globe className="w-12 h-12" />}
            title="Multistreaming"
            description="Стримьте одновременно на все популярные платформы."
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12" />}
            title="Моментальный старт"
            description="От идеи до эфира за 2 минуты. Прямо в браузере."
          />
          <FeatureCard
            icon={<Video className="w-12 h-12" />}
            title="HD качество"
            description="До 1080p при 60fps для профессионального качества."
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12" />}
            title="Безопасность"
            description="End-to-end шифрование и защита ваших трансляций."
          />
          <FeatureCard
            icon={<Cloud className="w-12 h-12" />}
            title="Облачная запись"
            description="Автоматическая запись и хранение всех трансляций."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12">
          <h3 className="text-4xl font-bold text-white mb-4">
            Готовы начать?
          </h3>
          <p className="text-xl text-white/90 mb-8">
            Присоединяйтесь к тысячам стримеров уже сегодня
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-12 py-4 bg-white text-primary-600 text-lg font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Создать аккаунт
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
          <p>&copy; 2025 StreamYard Clone. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-studio-accent/50 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-primary-500/50 transition-all">
      <div className="text-primary-500 mb-4">{icon}</div>
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}



