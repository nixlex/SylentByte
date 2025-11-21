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

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="p-8 max-w-[1200px] mx-auto">
        <section className="bg-[#2d2d2d] p-6 rounded-lg border-l-[5px] border-[#4CAF50] mb-8">
          <h1 className="text-[#4CAF50] text-3xl">Список предоставляемых услуг</h1>
        </section>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 py-8">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

