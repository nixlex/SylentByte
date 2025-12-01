import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        localStorage.setItem('token', data.data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || data.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-200px)]">
        <div className="bg-[#2d2d2d] p-6 sm:p-8 rounded-lg border-2 border-[#4CAF50] w-full max-w-md animate-fadeIn">
          <h1 className="text-[#4CAF50] text-2xl sm:text-3xl mb-6 text-center">Регистрация</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#cccccc] mb-2">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#3d3d3d] border border-[#4CAF50] rounded text-white focus:outline-none focus:border-cyan-400 transition-all"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label className="block text-[#cccccc] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#3d3d3d] border border-[#4CAF50] rounded text-white focus:outline-none focus:border-cyan-400 transition-all"
                placeholder="example@mail.com"
              />
            </div>

            <div>
              <label className="block text-[#cccccc] mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-[#3d3d3d] border border-[#4CAF50] rounded text-white focus:outline-none focus:border-cyan-400 transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-[#cccccc] mb-2">Подтвердите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-[#3d3d3d] border border-[#4CAF50] rounded text-white focus:outline-none focus:border-cyan-400 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-2 rounded animate-slideDown">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4CAF50] text-white py-2 rounded hover:bg-[#45a049] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loader mr-2"></div>
                  Регистрация...
                </span>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-[#cccccc] text-sm">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-[#4CAF50] hover:text-cyan-400 transition-colors">
              Войти
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

