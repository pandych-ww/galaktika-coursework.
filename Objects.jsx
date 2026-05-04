import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const localObjects = [
  {
  id: 1,
  title: 'ЖК «Ривер Парк Кутузовский»',
  city: 'Москва, Нагатинский Затон',
  area: '230 000 м²',
  year: '2024',
  category: 'residential',
  categoryLabel: 'Жилой комплекс',
  images: [
    '/галерея/riv3.jpg',
    '/галерея/riv2.jpg',
    '/галерея/riv1.jpg'
  ],
  description: 'ЖК «Ривер Парк Коломенское» — жилой комплекс бизнес-класса на юге Москвы, расположенный у воды в районе Нагатинского затона. Проект включает 20 корпусов переменной этажности, собственную набережную, дворы без машин, школу, детский сад и развитую инфраструктуру для жизни у реки.' 

  },
  {
    id: 2, 
    title: 'БЦ «Лахта Центр»', 
    city: 'Санкт-Петербург', 
    area: '140 000 м²', 
    year: '2023',
    category: 'commercial', 
    categoryLabel: 'Бизнес-центр',
    images: [
      '/галерея/Lakhta1.png',
      '/галерея/Lakhta2.jpg',
      '/галерея/Lakhta3.jpg'
    ],
    description: 'Один из самых высоких небоскребов Европы. Панорамные виды на Финский залив, офисы класса А, смотровая площадка.'
  },
  {
    id: 3, 
    title: 'ЖК «Сколково Парк»', 
    city: 'Москва, Сколково', 
    area: '85 000 м²', 
    year: '2024',
    category: 'residential', 
    categoryLabel: 'Жилой комплекс',
    images: [
      '/галерея/сколково1.webp',
      '/галерея/сколково2.webp',
      '/галерея/сколково3.webp'
    ],
    description: 'Инновационный жилой комплекс в Сколково. Экологичные материалы, умные системы управления домом, коворкинги.'
  },
  {
    id: 4, 
    title: 'ТРЦ «Галерея»', 
    city: 'Краснодар', 
    area: '55 000 м²', 
    year: '2023',
    category: 'commercial', 
    categoryLabel: 'Торговый центр',
    images: [
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Крупнейший ТРЦ Краснодара. Более 150 магазинов, кинотеатр, фуд-корт, детский развлекательный центр.'
  },
  {
    id: 5, 
    title: 'КП «Резиденция»', 
    city: 'Сочи', 
    area: '25 000 м²', 
    year: '2024',
    category: 'cottage', 
    categoryLabel: 'Коттеджный посёлок',
    images: [
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Элитный коттеджный поселок у моря. Вид на море, пляжная зона, охраняемая территория, теннисные корты.'
  },
  {
    id: 6, 
    title: 'ЖК «Северная Корона»', 
    city: 'Екатеринбург', 
    area: '65 000 м²', 
    year: '2024',
    category: 'residential', 
    categoryLabel: 'Жилой комплекс',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Премиальный жилой комплекс в центре Екатеринбурга. Панорамное остекление, закрытый двор, фитнес-клуб.'
  },
  {
    id: 7, 
    title: 'БЦ «White Stone»', 
    city: 'Москва', 
    area: '40 000 м²', 
    year: '2023',
    category: 'commercial', 
    categoryLabel: 'Бизнес-центр',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Бизнес-центр класса А в Москве. Современные системы, 24/7 охрана, видеонаблюдение, конференц-залы.'
  },
  {
    id: 8, 
    title: 'КП «Золотые Пески»', 
    city: 'Калининград', 
    area: '15 000 м²', 
    year: '2024',
    category: 'cottage', 
    categoryLabel: 'Коттеджный посёлок',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Уютный коттеджный поселок недалеко от моря. Собственный парк, детские площадки, круглосуточная охрана.'
  },
  {
    id: 9, 
    title: 'ЖК «Петровский Парк»', 
    city: 'Казань', 
    area: '48 000 м²', 
    year: '2023',
    category: 'residential', 
    categoryLabel: 'Жилой комплекс',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Жилой комплекс рядом с парком. Развитая инфраструктура, детские площадки, зоны отдыха, школа рядом.'
  },
  {
    id: 10, 
    title: 'БЦ «Высоцкий»', 
    city: 'Екатеринбург', 
    area: '52 000 м²', 
    year: '2022',
    category: 'commercial', 
    categoryLabel: 'Бизнес-центр',
    images: [
      'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Легендарный бизнес-центр в Екатеринбурге. Панорамный вид на город, современные офисные пространства.'
  },
  {
    id: 11, 
    title: 'ЖК «Адмирал»', 
    city: 'Владивосток', 
    area: '35 000 м²', 
    year: '2024',
    category: 'residential', 
    categoryLabel: 'Жилой комплекс',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Жилой комплекс с видом на море во Владивостоке. Современные планировки, подземный паркинг, детский сад.'
  },
  {
    id: 12, 
    title: 'ТРЦ «Планета»', 
    city: 'Новосибирск', 
    area: '70 000 м²', 
    year: '2023',
    category: 'commercial', 
    categoryLabel: 'Торговый центр',
    images: [
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Крупнейший торгово-развлекательный центр Новосибирска. Кинотеатр IMAX, фуд-корт, детский центр.'
  }
];

function ObjectCard({ obj }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Автопрокрутка фотографий
  useEffect(() => {
    // Запускаем интервал только если есть больше 1 фото и карточка не под курсором
    if (obj.images.length <= 1) return;
    if (isHovered) return; // Останавливаем автопрокрутку при наведении
    
    const interval = setInterval(() => {
      setImgIndex((prevIndex) => (prevIndex + 1) % obj.images.length);
    }, 3000); // Меняем фото каждые 3 секунды
    
    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, [obj.images.length, isHovered]);

  const nextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((imgIndex + 1) % obj.images.length);
  };

  const prevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((imgIndex - 1 + obj.images.length) % obj.images.length);
  };

  return (
    <Link 
      to={`/objects/${obj.id}`} 
      className="object-card-link"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="object-card">
        <div className="card-img-wrapper">
          <img
            src={obj.images[imgIndex]}
            alt={obj.title}
          />
          {obj.images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="card-nav prev"
                aria-label="Предыдущее фото"
              >
                ‹
              </button>
              <button
                onClick={nextImg}
                className="card-nav next"
                aria-label="Следующее фото"
              >
                ›
              </button>
              <div className="image-dots">
                {obj.images.map((_, i) => (
                  <div
                    key={i}
                    className={`dot ${i === imgIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImgIndex(i);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="object-info">
          <span className="object-category">{obj.categoryLabel}</span>
          <h3>{obj.title}</h3>
          <div className="object-details">
            <p><i className="fa-solid fa-location-dot"></i> {obj.city}</p>
            <p><i className="fa-solid fa-ruler"></i> {obj.area}</p>
            <p><i className="fa-solid fa-calendar-check"></i> Сдан в {obj.year}</p>
          </div>
          <div className="object-preview">
            <p className="preview-text">{obj.description}</p>
            <span className="more-link">Подробнее</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Objects() {
  const [objects, setObjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Для демонстрации используем локальные данные
    setTimeout(() => {
      setObjects(localObjects);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = filter === 'all' ? objects : objects.filter(o => o.category === filter);

  return (
    <div className="page objects-page">
      <div className="page-hero">
        <div className="page-hero-overlay"></div>
        <div className="hero-content">
          <h1>Наши объекты</h1>
          <p>Более 200 реализованных проектов по всей России</p>
        </div>
      </div>
      
      <section className="objects-section">
        <div className="container">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Все объекты
            </button>
            <button
              className={`filter-btn ${filter === 'residential' ? 'active' : ''}`}
              onClick={() => setFilter('residential')}
            >
              Жилые комплексы
            </button>
            <button
              className={`filter-btn ${filter === 'commercial' ? 'active' : ''}`}
              onClick={() => setFilter('commercial')}
            >
              Коммерческая
            </button>
            <button
              className={`filter-btn ${filter === 'cottage' ? 'active' : ''}`}
              onClick={() => setFilter('cottage')}
            >
              Коттеджи
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Загрузка объектов...</p>
            </div>
          ) : (
            <div className="objects-grid-full">
              {filtered.map(obj => (
                <ObjectCard key={obj.id} obj={obj} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Objects;