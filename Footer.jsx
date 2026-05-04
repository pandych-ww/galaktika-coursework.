import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3><i className="fa-solid fa-galactic-republic"></i> GALAKTIKA</h3>
          <p>Строительная компания полного цикла. Проектируем и строим с 2010 года.</p>
          <div className="social-links">
            <a href="#"><i className="fa-brands fa-vk"></i></a>
            <a href="#"><i className="fa-brands fa-telegram"></i></a>
            <a href="#"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Навигация</h4>
          <Link to="/">Главная</Link>
          <Link to="/objects">Объекты</Link>
          <Link to="/services">Услуги</Link>
          <Link to="/contacts">Контакты</Link>
        </div>
        <div className="footer-links">
          <h4>Контакты</h4>
          <p><i className="fa-solid fa-phone"></i> +7 (952) 123-45-67</p>
          <p><i className="fa-solid fa-envelope"></i> info@galaktika-build.ru</p>
          <p><i className="fa-solid fa-location-dot"></i> Москва, ул. Строителей, 15</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Строительная компания «GALAKTIKA». Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;