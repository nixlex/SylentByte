import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Main() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="p-8 max-w-[1000px] mx-auto">
        <div className="bg-[#2d2d2d] p-6 rounded-lg border-l-[5px] border-[#4CAF50]">
          <h1 className="text-[#4CAF50] text-3xl mb-5">Почему именно мы?</h1>
          <ul className="space-y-3">
            <li className="p-3 bg-[#3d3d3d] rounded">
              <strong className="text-[#4CAF50]">Этичный подход:</strong> все действия строго в рамках закона и договора.
            </li>
            <li className="p-3 bg-[#3d3d3d] rounded">
              <strong className="text-[#4CAF50]">Защита вашего бизнеса:</strong> выявляем и исправляем уязвимости до того, как их обнаружат злоумышленники.
            </li>
            <li className="p-3 bg-[#3d3d3d] rounded">
              <strong className="text-[#4CAF50]">Опытная команда:</strong> сертифицированные специалисты по кибербезопасности.
            </li>
            <li className="p-3 bg-[#3d3d3d] rounded">
              <strong className="text-[#4CAF50]">Современные методы:</strong> используем актуальные технологии и инструменты пентеста.
            </li>
            <li className="p-3 bg-[#3d3d3d] rounded">
              <strong className="text-[#4CAF50]">Прозрачность и отчётность:</strong> предоставляем детальные отчёты и рекомендации.
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
