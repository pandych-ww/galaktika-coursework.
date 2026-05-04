import { useState, useEffect } from 'react';

const slides = [
  {
    image: '/галерея/квартал.jpg',
    title: 'Современные жилые кварталы',
    subtitle: 'Архитектура, продуманная до мельчайших деталей для вашего комфорта',
  },
  {
    image: '/галерея/безопасность.webp',
    title: 'Уют и безопасность',
    subtitle: 'Закрытые дворы-парки/территории и современные системы видеонаблюдения',
  },
  {
    image: '/галерея/резиденция.jpg',
    title: 'Загородная резиденция',
    subtitle: 'Коттеджные поселки в экологически чистых районах',
  },
  {
    image: '/галерея/площадь.jpg',
    title: 'Объекты с историей',
    subtitle: 'Реставрация и возведение объектов в классическом стиле',
  },
  {
    image: '/галерея/домквартрира.jfif',
    title: 'Ваш идеальный дом или квартира',
    subtitle: 'Индивидуальное проектирование под запросы вашей семьи',
  },
  {
    image: '/галерея/бизнес.jpeg',
    title: 'Бизнес-центры класса A',
    subtitle: 'Технологичные пространства для эффективной работы вашей команды',
  },
  {
    image: '/галерея/офисы.jpg',
    title: 'Офисы будущего',
    subtitle: 'Open-space планировки и умные инженерные системы',
  },
  {
    image: '/галерея/вегас.jpg',
    title: 'Торговые пространства',
    subtitle: 'Строительство ТРЦ с высокой проходимостью и логистикой',
  },
  {
    image: '/галерея/склад.jpg',
    title: 'Складские терминалы',
    subtitle: 'Современные логистические хабы под ключ',
  },
  {
    image: '/галерея/кресты.jpg',
    title: 'Прозрачность сделок',
    subtitle: 'Работаем в строгом соответствии с ФЗ-214, но не всегда получается',
  },
  {
    image: '/галерея/отделка.jpeg',
    title: 'Готовая отделка',
    subtitle: 'Вам остается только перевезти личные вещи',
  },
  {
    image: '/галерея/панарама.jpg',
    title: 'Панорамное остекление',
    subtitle: 'Максимум естественного света в вашей квартире',
  },
  {
    image: '/галерея/вход.jpg',
    title: 'Лобби и входные группы',
    subtitle: 'Дизайнерская отделка общественных пространств',
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-overlay"></div>
          <div className="slide-content">
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
          </div>
        </div>
      ))}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;