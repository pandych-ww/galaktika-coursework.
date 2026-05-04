import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';

function Home() {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/objects')
      .then(res => res.json())
      .then(data => setObjects(data.slice(0, 3)));
  }, []);

  return (
    <div className="page home-page">
      <HeroSlider />

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Завершённых проектов</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50 000 м²</span>
              <span className="stat-label">Построено в 2024</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15 лет</span>
              <span className="stat-label">На рынке строительства</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Сдано в срок</span>
            </div>
          </div>
        </div>
      </section>

      <section className="preview-section">
        <div className="container">
          <h2>Наши последние проекты</h2>
          <div className="preview-grid">
            {objects.map(obj => (
              <div className="preview-card" key={obj.id}>
                <img src={obj.image} alt={obj.title} />
                <h3>{obj.title}</h3>
                <p>{obj.city}</p>
              </div>
            ))}
          </div>
          <div className="center-btn">
            <Link to="/objects" className="btn-primary">Смотреть все объекты</Link>
          </div>
        </div>
      </section>
      

      <section className="cta-section">
        <div className="container">
          <h2>Готовы начать строительство?</h2>
          <p>Свяжитесь с нами, и мы предложим лучшее решение для вашего проекта.</p>
          <Link to="/contacts" className="btn-primary">Связаться с нами</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;