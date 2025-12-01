import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="p-4 sm:p-8">
        <section className="p-4 sm:p-5 mb-6 sm:mb-8">
          <h1 className="text-[#4CAF50] text-2xl sm:text-3xl text-center mb-6 sm:mb-8 hover:text-cyan-400 transition animate-fadeIn">
            Коротко о нас
          </h1>
          <div className="flex justify-center sm:justify-around flex-wrap gap-4 sm:gap-8 p-4 sm:p-12">
            <article className="bg-[#2d2d2d] w-full sm:w-[350px] rounded-lg border-2 border-[#4CAF50] p-4 sm:p-5 hover:border-cyan-400 transition-all duration-300 hover:scale-105 animate-slideInUp">
              <h2 className="text-[#4CAF50] text-xl mb-3 text-center hover:text-cyan-400 transition">
                Frontex
              </h2>
              <p className="text-[#cccccc]">
                Fronted-разработчик, кибербезопасник. <br />
                Создаёт лицевую сторону сайта и так же проверяет <br />
                на утечку информации из баз данных.
              </p>
            </article>
            <article className="bg-[#2d2d2d] w-full sm:w-[350px] rounded-lg border-2 border-[#4CAF50] p-4 sm:p-5 hover:border-cyan-400 transition-all duration-300 hover:scale-105 animate-slideInUp">
              <h2 className="text-[#4CAF50] text-xl mb-3 text-center hover:text-cyan-400 transition">
                il061-rgb
              </h2>
              <p className="text-[#cccccc]">
                Fronted-разработчик, 1С-разработчик. <br />
                Создаёт лицевую сторону сайта, создаёт <br />
                бухгалтерский учёт для финансов.
              </p>
            </article>
            <article className="bg-[#2d2d2d] w-full sm:w-[350px] rounded-lg border-2 border-[#4CAF50] p-4 sm:p-5 hover:border-cyan-400 transition-all duration-300 hover:scale-105 animate-slideInUp">
              <h2 className="text-[#4CAF50] text-xl mb-3 text-center hover:text-cyan-400 transition">
                izzkide
              </h2>
              <p className="text-[#cccccc]">
                Кибербезопасник. <br />
                Проверяет утечку информации.
              </p>
            </article>
          </div>
        </section>

        <section className="flex justify-center">
          <div className="bg-[#2d2d2d] rounded-lg border-2 border-[#4CAF50] w-full max-w-[1200px] p-4 sm:p-8 hover:border-cyan-400 transition-all duration-300 animate-slideInUp">
            <h1 className="flex justify-center text-[#4CAF50] text-3xl mb-6 hover:text-cyan-400 transition">
              О нашей команде
            </h1>
            <p className="text-[#cccccc] leading-relaxed text-sm sm:text-base">
              Наша команда — это сплочённая группа высококлассных специалистов, объединяющая экспертизу в области веб-разработки и кибербезопасности. Мы создаём современные, функциональные и, что самое главное, безопасные цифровые продукты для наших клиентов.
              <br /><br />
              Наш ключевой принцип — синергия. Мы не просто выполняем задачи, а комплексно подходим к каждому проекту:
              <br /><br />
              Создание интуитивного интерфейса: Наши frontend-разработчики воплощают ваши идеи в жизнь, создавая удобные, быстрые и визуально привлекательные сайты, с которыми будет приятно работать вашим пользователям.
              <br /><br />
              Разработка backend-логики и финансовых систем: Мы обладаем глубокой экспертизой в области разработки под платформу «1С», что позволяет нам автоматизировать бухгалтерский и финансовый учёт, интегрируя его с веб-решениями для полной цифровизации бизнес-процессов.
              <br /><br />
              Гарантия безопасности: Наши кибербезопасники непрерывно следят за защищённостью проектов. Мы proactively выявляем и устраняем уязвимости, предотвращаем утечки данных из баз данных и обеспечиваем полное соответствие стандартам информационной безопасности.
              <br /><br />
              Таким образом, мы предлагаем не разрозненные услуги, а готовое, безопасное и технологичное решение, которое решает ваши бизнес-задачи и защищает ваши данные.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

