import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Specialists() {
  const specialists = [
    {
      name: 'Frontex',
      role: 'Разработчик, пентестер, владелец проекта'
    },
    {
      name: 'izzkide',
      role: 'Специалист кибер безопасности'
    },
    {
      name: 'il061-rgb',
      role: 'Разработчик'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="p-8 max-w-[1000px] mx-auto">
        <section className="bg-[#2d2d2d] p-6 rounded-lg border-l-[5px] border-[#4CAF50] mb-8">
          <h1 className="text-[#4CAF50] text-3xl mb-4">Наши специалисты</h1>
          <p className="text-[#cccccc]">Профессионалы с многолетним опытом в области кибербезопасности</p>
        </section>

        <section className="flex flex-wrap justify-center gap-4">
          {specialists.map((specialist, index) => (
            <article
              key={index}
              className="bg-[#2d2d2d] p-5 rounded-lg border-2 border-[#4CAF50] text-center w-[250px]"
            >
              <h2 className="text-[#4CAF50] text-xl mb-2">{specialist.name}</h2>
              <p className="text-[#cccccc]">{specialist.role}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

