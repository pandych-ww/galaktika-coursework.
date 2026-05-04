import { Link } from 'react-router-dom';

const services = [
  { icon: 'fa-building', title: 'Жилые комплексы', desc: 'Многоквартирные дома классов «комфорт», «бизнес» и «премиум».', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80' },
  { icon: 'fa-city', title: 'Коммерческая недвижимость', desc: 'Бизнес-центры, торговые комплексы, офисные здания.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
  { icon: 'fa-house-chimney', title: 'Коттеджные посёлки', desc: 'Загородные дома, таунхаусы с авторской архитектурой.', image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=600&q=80' },
  { icon: 'fa-warehouse', title: 'Промышленные объекты', desc: 'Склады, производственные цеха, логистические центры.', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80' },
  { icon: 'fa-hammer', title: 'Реконструкция', desc: 'Восстановление и модернизация существующих зданий.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80' },
  { icon: 'fa-paint-roller', title: 'Отделочные работы', desc: 'Полный спектр внутренней и внешней отделки.', image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=600&q=80' },
];

function Services() {
  return (
    <div className="page services-page">
      <div className="page-hero">
        <div className="page-hero-overlay"></div>
        <h1>Наши услуги</h1>
        <p>Полный цикл строительства — от идеи до ключей</p>
      </div>
      <section className="container">
        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card" key={i}>
              <div className="service-img">
                <img src={s.image} alt={s.title} />
              </div>
              <div className="service-body">
                <i className={`fa-solid ${s.icon}`}></i>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="center-btn" style={{ marginTop: '40px' }}>
          <Link to="/contacts" className="btn-primary">Заказать консультацию</Link>
        </div>
      </section>
    </div>
  );
}

export default Services;