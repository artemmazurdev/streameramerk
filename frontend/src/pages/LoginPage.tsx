import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Video, Mail, Lock } from 'lucide-react';
import apiService from '@services/api.service';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.login(email, password);
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-studio-darker via-studio-dark to-studio-accent flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Video className="w-12 h-12 text-primary-500" />
            <h1 className="text-3xl font-bold text-white">StreamYard</h1>
          </div>
          <p className="text-gray-400">Войдите в свой аккаунт</p>
        </div>

        {/* Form */}
        <div className="bg-studio-accent/50 backdrop-blur-sm rounded-xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-600/20 border border-red-600 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-studio-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-studio-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white font-medium rounded-lg transition-all"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/forgot-password"
              className="block text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              Забыли пароль?
            </Link>
            <div className="text-gray-400 text-sm">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 transition-colors">
                Зарегистрироваться
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}



