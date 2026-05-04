import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const localObjects = [
  {
    id: 1, 
    title: 'ЖК «Москва-Сити»', 
    city: 'Москва, ЦАО', 
    area: '120 000 м²', 
    year: '2024',
    category: 'residential', 
    categoryLabel: 'Жилой комплекс',
    description: 'Элитный жилой комплекс в самом сердце Москвы с панорамными видами на город. Современная архитектура от мировых архитекторов, развитая инфраструктура включает подземный паркинг, фитнес-центр с бассейном, детский сад и школу на территории. Закрытая охраняемая территория с видеонаблюдением 24/7. Отделка премиум-класса с использованием натуральных материалов.',
    developer: 'Capital Group',
    floors: '35-58 этажей',
    apartments: '1 250 квартир',
    price: 'от 25 000 000 ₽',
    status: 'Сдан в эксплуатацию',
    completionDate: 'IV квартал 2024',
    ceilingHeight: '3.2 м',
    parking: 'Подземный паркинг на 2 500 мест',
    security: 'Круглосуточная охрана, видеонаблюдение, контрольно-пропускной пункт',
    infrastructure: 'Фитнес-центр, спа-салон, детский сад, школа, супермаркет, кафе, зоны отдыха',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    coordinates: { lat: 55.751244, lng: 37.618423 }
  },
  {
    id: 2, 
    title: 'БЦ «Лахта Центр»', 
    city: 'Санкт-Петербург', 
    area: '140 000 м²', 
    year: '2023',
    category: 'commercial', 
    categoryLabel: 'Бизнес-центр',
    description: 'Один из самых высоких небоскребов Европы (462 метра). Уникальная архитектура, панорамные виды на Финский залив и исторический центр Санкт-Петербурга. Офисные пространства класса А с инновационными системами энергоэффективности. На территории: конференц-залы, рестораны, смотровая площадка, медицинский центр.',
    developer: 'Газпром',
    floors: '87 этажей',
    offices: 'от 50 до 2000 м²',
    parking: 'На 2000 мест (подземный и наземный)',
    status: 'Работает',
    ceilingHeight: '4.5 м',
    features: 'Смотровая площадка, рестораны, конференц-залы',
    infrastructure: 'Рестораны, кафе, медицинский центр, фитнес-центр, конференц-залы',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 3, 
    title: 'ЖК «Сколково Парк»', 
    city: 'Москва, Сколково', 
    area: '85 000 м²', 
    year: '2024',
    category: 'residential', 
    categoryLabel: 'Жилой комплекс',
    description: 'Инновационный жилой комплекс на территории иннограда Сколково. Экологичные материалы, умные системы управления домом, коворкинги, спортивные площадки. Территория комплекса включает парковую зону с велодорожками и зонами для пикников.',
    developer: 'Сколково Девелопмент',
    floors: '12-24 этажа',
    apartments: '780 квартир',
    price: 'от 18 000 000 ₽',
    status: 'Строительство завершено',
    completionDate: 'II квартал 2024',
    ceilingHeight: '3.0 м',
    parking: 'Подземный паркинг на 1 000 мест',
    security: 'Круглосуточная охрана, умное видеонаблюдение',
    infrastructure: 'Коворкинг, детский сад, школа, супермаркет, фитнес-центр, парковая зона',
    images: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 4, 
    title: 'ТРЦ «Галерея»', 
    city: 'Краснодар', 
    area: '55 000 м²', 
    year: '2023',
    category: 'commercial', 
    categoryLabel: 'Торговый центр',
    description: 'Крупнейший торгово-развлекательный центр Краснодара. Более 150 магазинов, кинотеатр, фуд-корт, детский развлекательный центр. Современные системы вентиляции и кондиционирования. Бесплатный Wi-Fi по всей территории.',
    developer: 'Ташир',
    stores: '150+ магазинов',
    parking: '1 200 мест',
    cinema: '8 залов',
    status: 'Работает',
    infrastructure: 'Кинотеатр, фуд-корт, детский центр, магазины одежды, электроники и товаров для дома',
    images: [
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 5, 
    title: 'КП «Резиденция»', 
    city: 'Сочи', 
    area: '25 000 м²', 
    year: '2024',
    category: 'cottage', 
    categoryLabel: 'Коттеджный посёлок',
    description: 'Элитный коттеджный поселок в Сочи. Вид на море, собственная пляжная зона, охраняемая территория, теннисные корты, спа-комплекс. Каждый участок оборудован системой умного полива и освещения.',
    developer: 'Альфа Девелопмент',
    lots: '45 участков',
    houses: 'от 300 до 600 м²',
    amenities: 'Бассейн, спа, ресторан',
    status: 'Продажа',
    infrastructure: 'Теннисные корты, спа-комплекс, ресторан, детские площадки, пляжная зона',
    images: [
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 6, 
    title: 'ЖК «Северная Корона»', 
    city: 'Екатеринбург', 
    area: '65 000 м²', 
    year: '2024',
    category: 'residential', 
    categoryLabel: 'Жилой комплекс',
    description: 'Премиальный жилой комплекс в центре Екатеринбурга. Панорамное остекление, закрытый двор без машин, фитнес-клуб с бассейном. Вид на город и живописную набережную.',
    developer: 'Брусника',
    floors: '28-32 этажа',
    apartments: '540 квартир',
    price: 'от 12 000 000 ₽',
    status: 'Сдан',
    completionDate: 'I квартал 2024',
    ceilingHeight: '3.1 м',
    parking: 'Подземный паркинг на 800 мест',
    infrastructure: 'Фитнес-клуб с бассейном, детский сад, магазины, зоны отдыха во дворе',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 7, 
    title: 'БЦ «White Stone»', 
    city: 'Москва', 
    area: '40 000 м²', 
    year: '2023',
    category: 'commercial', 
    categoryLabel: 'Бизнес-центр',
    description: 'Бизнес-центр класса А с отделкой white box. Современные системы вентиляции, 24/7 охрана, видеонаблюдение, конференц-залы. Панорамные окна с видом на Москву.',
    developer: 'Stone Hedge',
    floors: '15 этажей',
    offices: 'от 100 до 5000 м²',
    parking: '450 мест',
    status: 'Аренда',
    ceilingHeight: '3.5 м',
    infrastructure: 'Конференц-залы, переговорные комнаты, lounge-зона, кафе',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 8, 
    title: 'КП «Золотые Пески»', 
    city: 'Калининград', 
    area: '15 000 м²', 
    year: '2024',
    category: 'cottage', 
    categoryLabel: 'Коттеджный посёлок',
    description: 'Уютный коттеджный поселок недалеко от Балтийского моря. Собственный парк, детские площадки, круглосуточная охрана. Экологичные материалы строительства.',
    developer: 'Балтстрой',
    lots: '30 участков',
    houses: 'от 250 до 450 м²',
    amenities: 'Рыболовный пруд',
    status: 'Продажа',
    infrastructure: 'Парковая зона, детские площадки, пруд для рыбалки',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 9, 
    title: 'ЖК «Петровский Парк»', 
    city: 'Казань', 
    area: '48 000 м²', 
    year: '2023',
    category: 'residential', 
    categoryLabel: 'Жилой комплекс',
    description: 'Жилой комплекс рядом с парком. Развитая инфраструктура, детские площадки, зоны отдыха, школа рядом. Современные планировки и качественная отделка.',
    developer: 'Унистрой',
    floors: '16-20 этажей',
    apartments: '620 квартир',
    price: 'от 8 500 000 ₽',
    status: 'Сдан',
    completionDate: 'III квартал 2023',
    ceilingHeight: '2.8 м',
    parking: 'Многоуровневый паркинг',
    infrastructure: 'Школа рядом, детские площадки, спортивные зоны, магазины',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 10, 
    title: 'БЦ «Высоцкий»', 
    city: 'Екатеринбург', 
    area: '52 000 м²', 
    year: '2022',
    category: 'commercial', 
    categoryLabel: 'Бизнес-центр',
    description: 'Легендарный бизнес-центр в Екатеринбурге. Панорамный вид на город, современные офисные пространства. Смотровая площадка для посетителей.',
    developer: 'УГМК',
    floors: '54 этажа',
    offices: 'от 80 до 3000 м²',
    parking: '600 мест',
    status: 'Работает',
    ceilingHeight: '3.8 м',
    infrastructure: 'Смотровая площадка, рестораны, конференц-залы',
    images: [
      'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 11, 
    title: 'ЖК «Адмирал»', 
    city: 'Владивосток', 
    area: '35 000 м²', 
    year: '2024',
    category: 'residential', 
    categoryLabel: 'Жилой комплекс',
    description: 'Жилой комплекс с видом на море во Владивостоке. Современные планировки, подземный паркинг, детский сад. Панорамные окна и морской воздух.',
    developer: 'Восток Девелопмент',
    floors: '22-26 этажей',
    apartments: '380 квартир',
    price: 'от 9 000 000 ₽',
    status: 'Строительство',
    completionDate: 'IV квартал 2024',
    ceilingHeight: '3.0 м',
    parking: 'Подземный паркинг',
    infrastructure: 'Детский сад, магазины, спортивная площадка',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 12, 
    title: 'ТРЦ «Планета»', 
    city: 'Новосибирск', 
    area: '70 000 м²', 
    year: '2023',
    category: 'commercial', 
    categoryLabel: 'Торговый центр',
    description: 'Крупнейший торгово-развлекательный центр Новосибирска. Кинотеатр IMAX, фуд-корт, детский центр, более 200 магазинов. Современные системы безопасности.',
    developer: 'Мегаполис',
    stores: '200+ магазинов',
    parking: '1 500 мест',
    cinema: 'IMAX 12 залов',
    status: 'Работает',
    infrastructure: 'Кинотеатр IMAX, детский развлекательный центр, фуд-корт, магазины',
    images: [
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

function ObjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const found = localObjects.find(o => o.id === parseInt(id));
      setObject(found || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const nextImage = () => {
    if (object && object.images.length > 0) {
      setActiveImage((prev) => (prev + 1) % object.images.length);
    }
  };

  const prevImage = () => {
    if (object && object.images.length > 0) {
      setActiveImage((prev) => (prev - 1 + object.images.length) % object.images.length);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка объекта...</p>
      </div>
    );
  }

  if (!object) {
    return (
      <div className="not-found-container">
        <h2>Объект не найден</h2>
        <p>К сожалению, запрашиваемый объект не существует</p>
        <button className="back-home-btn" onClick={() => navigate('/objects')}>
          Вернуться к объектам
        </button>
      </div>
    );
  }

  return (
    <div className="object-page">
      <div className="container">
        {/* Кнопка возврата */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Назад
        </button>

        {/* Галерея */}
        <div className="object-gallery">
          <div className="main-image-container">
            {object.images && object.images.length > 0 && (
              <>
                <img src={object.images[activeImage]} alt={object.title} className="main-image" />
                {object.images.length > 1 && (
                  <>
                    <button className="gallery-nav prev" onClick={prevImage}>‹</button>
                    <button className="gallery-nav next" onClick={nextImage}>›</button>
                  </>
                )}
              </>
            )}
          </div>
          {object.images && object.images.length > 1 && (
            <div className="thumbnail-list">
              {object.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${object.title} ${idx + 1}`}
                  className={`thumbnail ${idx === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Основная информация */}
        <div className="object-header">
          <span className="object-category">{object.categoryLabel}</span>
          <h1>{object.title}</h1>
          <div className="object-meta">
            <div className="meta-item">
              <i className="fa-solid fa-location-dot"></i>
              <span>{object.city}</span>
            </div>
            <div className="meta-item">
              <i className="fa-solid fa-ruler"></i>
              <span>Площадь: {object.area}</span>
            </div>
            <div className="meta-item">
              <i className="fa-solid fa-calendar-check"></i>
              <span>Сдан в {object.year}</span>
            </div>
          </div>
        </div>

        <div className="object-grid">
          {/* Левая колонка - описание и характеристики */}
          <div className="object-description-section">
            <div className="info-block">
              <h2>Описание объекта</h2>
              <p>{object.description}</p>
            </div>

            <div className="info-block">
              <h2>Характеристики</h2>
              <div className="characteristics-grid">
                <div className="char-item">
                  <span className="char-label">Застройщик:</span>
                  <span className="char-value">{object.developer || 'Не указан'}</span>
                </div>
                <div className="char-item">
                  <span className="char-label">Этажность:</span>
                  <span className="char-value">{object.floors || 'Не указана'}</span>
                </div>
                <div className="char-item">
                  <span className="char-label">{object.apartments ? 'Квартир:' : (object.offices ? 'Офисов:' : 'Объектов:')}</span>
                  <span className="char-value">{object.apartments || object.offices || object.stores || 'Не указано'}</span>
                </div>
                <div className="char-item">
                  <span className="char-label">Высота потолков:</span>
                  <span className="char-value">{object.ceilingHeight || 'Не указана'}</span>
                </div>
                <div className="char-item">
                  <span className="char-label">Паркинг:</span>
                  <span className="char-value">{object.parking || 'Не указан'}</span>
                </div>
                <div className="char-item">
                  <span className="char-label">Статус:</span>
                  <span className="char-value status">{object.status || 'В работе'}</span>
                </div>
              </div>
            </div>

            <div className="info-block">
              <h2>Инфраструктура</h2>
              <p>{object.infrastructure || 'Развитая инфраструктура района включает магазины, рестораны, спортивные клубы и зоны отдыха.'}</p>
            </div>
          </div>

          {/* Правая колонка - преимущества, документы, цена */}
          <div className="object-sidebar">
            <div className="info-card">
              <h3>Ключевые преимущества</h3>
              <ul className="features-list">
                <li>✓ Престижное местоположение</li>
                <li>✓ Высокое качество строительства</li>
                <li>✓ Современные технологии</li>
                <li>✓ Развитая инфраструктура</li>
                <li>✓ Безопасность 24/7</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>Документация</h3>
              <div className="docs-list">
                <a href="#" className="doc-link" onClick={(e) => e.preventDefault()}>
                  <i className="fa-solid fa-file-pdf"></i> Презентация объекта
                </a>
                <a href="#" className="doc-link" onClick={(e) => e.preventDefault()}>
                  <i className="fa-solid fa-file-pdf"></i> Планировки
                </a>
                <a href="#" className="doc-link" onClick={(e) => e.preventDefault()}>
                  <i className="fa-solid fa-file-pdf"></i> Декларация
                </a>
              </div>
            </div>

            {object.price && (
              <div className="info-card price-card">
                <h3>Стоимость</h3>
                <div className="price-value">{object.price}</div>
                <p className="price-note">*Цена указана за базовую комплектацию</p>
              </div>
            )}
          </div>
        </div>

        {/* Карта (опционально) */}
        {object.coordinates && (
          <div className="map-section">
            <h2>Расположение на карте</h2>
            <div className="map-placeholder">
              <i className="fa-solid fa-map-location-dot"></i>
              <p>г. {object.city}</p>
              <small>Точное расположение уточняйте у менеджера</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ObjectPage;