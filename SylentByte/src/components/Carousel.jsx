import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Carousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    gsap.fromTo(
      `.carousel-item-${currentIndex}`,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.5 }
    );
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`carousel-item-${index} min-w-full`}
          >
            {item}
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#4CAF50] text-white p-2 rounded-full hover:bg-[#45a049] transition-all z-10"
        aria-label="Предыдущий"
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#4CAF50] text-white p-2 rounded-full hover:bg-[#45a049] transition-all z-10"
        aria-label="Следующий"
      >
        →
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-[#4CAF50] w-8' : 'bg-[#cccccc]'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

