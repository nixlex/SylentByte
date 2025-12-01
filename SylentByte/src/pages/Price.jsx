import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

export default function Price() {
  const products = [
    {
      title: 'Веб-пентест',
      description: 'Комплексное тестирование безопасности веб-приложений',
      features: [
        'Сбор информации',
        'Анализ уязвимостей',
        'Ручная валидация',
        'Проверка авторизации',
        'OWASP Top-10'
      ],
      price: 'от 30.000 ₽'
    },
    {
      title: 'Frontend разработка',
      description: 'Создание современного пользовательского интерфейса',
      features: [
        'Адаптивный дизайн',
        'Оптимизация производительности',
        'Кроссбраузерная совместимость',
        'Интеграция с API'
      ],
      price: 'от 25.000 ₽'
    },
    {
      title: '1С разработка',
      description: 'Автоматизация бухгалтерского и финансового учёта',
      features: [
        'Настройка конфигураций',
        'Разработка отчётов',
        'Интеграция с веб-системами',
        'Обучение персонала'
      ],
      price: 'от 40.000 ₽'
    },
    {
      title: 'Аудит безопасности',
      description: 'Проверка защищённости информационных систем',
      features: [
        'Анализ инфраструктуры',
        'Проверка баз данных',
        'Выявление утечек данных',
        'Рекомендации по улучшению'
      ],
      price: 'от 35.000 ₽'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slideInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.product-card-animate');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="p-4 sm:p-8 max-w-[1200px] mx-auto">
        <section className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border-l-[5px] border-[#4CAF50] mb-6 sm:mb-8 animate-fadeIn">
          <h1 className="text-[#4CAF50] text-2xl sm:text-3xl">Список предоставляемых услуг</h1>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-8 py-4 sm:py-8">
          {products.map((product, index) => (
            <div key={index} className="product-card-animate" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

