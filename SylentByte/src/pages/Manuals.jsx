import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Manuals() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="p-8 max-w-[1000px] mx-auto">
        <section className="bg-[#2d2d2d] p-6 rounded-lg border-l-[5px] border-[#4CAF50] mb-8">
          <h1 className="text-[#4CAF50] text-3xl mb-4">Обучающие материалы</h1>
          <p className="text-[#cccccc]">Изучайте кибербезопасность с нашими мануалами</p>
        </section>

        <article className="bg-[#2d2d2d] p-5 rounded-lg border border-[#4CAF50] mb-5">
          <iframe
            width="720"
            height="405"
            src="https://rutube.ru/play/embed/ea771b0cb6e0815a378c2ddfe04b5c5d/"
            className="w-full max-w-[720px] h-[405px] rounded border-none"
            allow="clipboard-write; autoplay"
            allowFullScreen
          />
          <p className="mt-4 text-[#4CAF50] text-center">
            Мануал по WireShark (Перехват интернет пакетов)
          </p>
        </article>

        <article className="bg-[#2d2d2d] p-5 rounded-lg border border-[#4CAF50] mb-5">
          <iframe
            width="720"
            height="405"
            src="https://rutube.ru/play/embed/6c98767e4efb75928c2cf907b3f6476a/"
            className="w-full max-w-[720px] h-[405px] rounded border-none"
            allow="clipboard-write; autoplay"
            allowFullScreen
          />
          <p className="mt-4 text-[#4CAF50] text-center">
            Как подключиться к серверу по SSH с ключом? Базовая защита SSH-соединения
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}

