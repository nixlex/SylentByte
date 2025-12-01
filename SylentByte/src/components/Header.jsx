import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="bg-[#2d2d2d] p-3 sm:p-5 border-b-[3px] border-[#4CAF50] sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto">
        <Link to="/" className="flex items-center">
          <img src="/accets/sb.png" alt="Логотип SylentByte" className="h-8 sm:h-10 mr-2 sm:mr-4" />
          <h1 className="text-[#4CAF50] text-lg sm:text-2xl font-bold">SylentByte Company</h1>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden md:flex gap-2 sm:gap-4">
            <Link to="/manuals">
              <button className="bg-[#4CAF50] text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base hover:bg-[#45a049] transition-all duration-300 hover:scale-105">
                Мануалы
              </button>
            </Link>
            <Link to="/specials">
              <button className="bg-[#4CAF50] text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base hover:bg-[#45a049] transition-all duration-300 hover:scale-105">
                Специалисты
              </button>
            </Link>
            <Link to="/price">
              <button className="bg-[#4CAF50] text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base hover:bg-[#45a049] transition-all duration-300 hover:scale-105">
                Прайс
              </button>
            </Link>
            <Link to="/about">
              <button className="bg-[#4CAF50] text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base hover:bg-[#45a049] transition-all duration-300 hover:scale-105">
                О нас
              </button>
            </Link>
            <Link to="/map">
              <button className="bg-[#4CAF50] text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base hover:bg-[#45a049] transition-all duration-300 hover:scale-105">
                Карта
              </button>
            </Link>
          </nav>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <button className="bg-[#4CAF50] text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base hover:bg-[#45a049] transition-all duration-300">
                  Кабинет
                </button>
              </Link>
              {(() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.role === 'admin') {
                  return (
                    <Link to="/admin">
                      <button className="bg-purple-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base hover:bg-purple-700 transition-all duration-300">
                        Админ
                      </button>
                    </Link>
                  );
                }
                return null;
              })()}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base hover:bg-red-700 transition-all duration-300"
              >
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/register">
                <button className="bg-[#3d3d3d] text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base hover:bg-[#4d4d4d] transition-all duration-300 border border-[#4CAF50]">
                  Регистрация
                </button>
              </Link>
              <Link to="/login">
                <button className="bg-[#4CAF50] text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base hover:bg-[#45a049] transition-all duration-300">
                  Вход
                </button>
              </Link>
            </>
          )}

          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden mt-4 animate-slideDown">
          <div className="flex flex-col gap-2">
            <Link to="/manuals" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] transition-all">
                Мануалы
              </button>
            </Link>
            <Link to="/specials" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] transition-all">
                Специалисты
              </button>
            </Link>
            <Link to="/price" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] transition-all">
                Прайс
              </button>
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] transition-all">
                О нас
              </button>
            </Link>
            <Link to="/map" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] transition-all">
                Карта
              </button>
            </Link>
            {!isLoggedIn && (
              <>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full bg-[#3d3d3d] text-white px-4 py-2 rounded hover:bg-[#4d4d4d] transition-all border border-[#4CAF50]">
                    Регистрация
                  </button>
                </Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] transition-all">
                    Вход
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
