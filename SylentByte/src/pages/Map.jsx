import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Ошибка получения геолокации:', error);
          setUserLocation({ lat: 55.7558, lng: 37.6173 });
        }
      );
    } else {
      setUserLocation({ lat: 55.7558, lng: 37.6173 });
    }
  }, []);

  useEffect(() => {
    if (userLocation && !mapLoaded) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(() => {
          const map = new window.ymaps.Map('map', {
            center: [userLocation.lat, userLocation.lng],
            zoom: 10
          });

          const markers = [
            { coords: [55.7558, 37.6173], title: 'Офис SylentByte', description: 'Главный офис компании' },
            { coords: [55.7520, 37.6156], title: 'Центр разработки', description: 'Отдел разработки' },
            { coords: [55.7512, 37.6184], title: 'Отдел безопасности', description: 'Кибербезопасность' }
          ];

          markers.forEach((marker) => {
            const placemark = new window.ymaps.Placemark(
              marker.coords,
              {
                balloonContent: `<strong>${marker.title}</strong><br>${marker.description}`
              },
              {
                preset: 'islands#greenDotIcon'
              }
            );

            map.geoObjects.add(placemark);
          });

          if (userLocation.lat && userLocation.lng) {
            const userPlacemark = new window.ymaps.Placemark(
              [userLocation.lat, userLocation.lng],
              {
                balloonContent: '<strong>Ваше местоположение</strong>'
              },
              {
                preset: 'islands#blueCircleDotIcon'
              }
            );
            map.geoObjects.add(userPlacemark);
          }

          setMapLoaded(true);
        });
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [userLocation, mapLoaded]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="p-4 sm:p-8 max-w-[1400px] mx-auto">
        <section className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border-l-[5px] border-[#4CAF50] mb-6 sm:mb-8 animate-fadeIn">
          <h1 className="text-[#4CAF50] text-2xl sm:text-3xl mb-4">Карта офисов</h1>
          <p className="text-[#cccccc]">Найдите наши офисы и ваше местоположение на карте</p>
        </section>

        <div className="bg-[#2d2d2d] rounded-lg overflow-hidden border-2 border-[#4CAF50] animate-slideInUp">
          <div id="map" className="w-full h-[400px] sm:h-[600px]" />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#4CAF50] hover:border-cyan-400 transition-all duration-300">
            <h3 className="text-[#4CAF50] font-semibold mb-2">Офис SylentByte</h3>
            <p className="text-[#cccccc] text-sm">Главный офис компании</p>
          </div>
          <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#4CAF50] hover:border-cyan-400 transition-all duration-300">
            <h3 className="text-[#4CAF50] font-semibold mb-2">Центр разработки</h3>
            <p className="text-[#cccccc] text-sm">Отдел разработки</p>
          </div>
          <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#4CAF50] hover:border-cyan-400 transition-all duration-300">
            <h3 className="text-[#4CAF50] font-semibold mb-2">Отдел безопасности</h3>
            <p className="text-[#cccccc] text-sm">Кибербезопасность</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
