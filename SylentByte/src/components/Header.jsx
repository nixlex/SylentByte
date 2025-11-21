import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-[#2d2d2d] p-5 border-b-[3px] border-[#4CAF50]">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto">
        <Link to="/" className="flex items-center">
          <img src="/accets/sb.png" alt="Логотип SylentByte" className="h-10 mr-4" />
          <h1 className="text-[#4CAF50] text-2xl font-bold">SylentByte Company</h1>
        </Link>
        <nav className="flex gap-4">
          <Link to="/manuals">
            <button className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] transition">
              Мануалы
            </button>
          </Link>
          <Link to="/specials">
            <button className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] transition">
              Специалисты
            </button>
          </Link>
          <Link to="/price">
            <button className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] transition">
              Прайс
            </button>
          </Link>
          <Link to="/about">
            <button className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] transition">
              О нас
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

