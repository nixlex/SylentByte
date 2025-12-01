import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Main() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="p-4 sm:p-8 max-w-[1000px] mx-auto">
        <div className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border-l-[5px] border-[#4CAF50] animate-fadeIn">
          <h1 className="text-[#4CAF50] text-2xl sm:text-3xl mb-4 sm:mb-5">Почему именно мы?</h1>
          <ul className="space-y-3">
            {[
              { title: 'Этичный подход', text: 'все действия строго в рамках закона и договора.' },
              { title: 'Защита вашего бизнеса', text: 'выявляем и исправляем уязвимости до того, как их обнаружат злоумышленники.' },
              { title: 'Опытная команда', text: 'сертифицированные специалисты по кибербезопасности.' },
              { title: 'Современные методы', text: 'используем актуальные технологии и инструменты пентеста.' },
              { title: 'Прозрачность и отчётность', text: 'предоставляем детальные отчёты и рекомендации.' }
            ].map((item, index) => (
              <li
                key={index}
                className="p-3 sm:p-4 bg-[#3d3d3d] rounded fade-in-on-scroll hover:bg-[#4d4d4d] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#4CAF50]/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <strong className="text-[#4CAF50]">{item.title}:</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
