import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const [iconIndex, setIconIndex] = useState(0);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Массив иконок
  const icons = [
    'fa-helmet-safety',
    'fa-building-columns',
    'fa-house-chimney',
    'fa-trowel',
    'fa-gears',
    'fa-cubes',
    'fa-trowel-bricks',
    'fa-ruler-combined',
    'fa-toolbox',
    'fa-hard-hat'
  ];

  // Смена иконки каждые 5 секунды
  useEffect(() => {
    const timer = setInterval(() => {
      setIconIndex(prev => (prev + 1) % icons.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <i className={`fa-solid ${icons[iconIndex]} logo-icon logo-icon-swap`}></i>
          <span className="logo-text">GALAKTIKA</span>
        </Link>

        {/* Часы */}
        <div className="navbar-clock">
          <i className="fa-regular fa-clock"></i> {time}
        </div>

        <div className="navbar-container">
          
          
          <div className="navbar-clock">
            <i className="fa-regular fa-clock"></i> {time}
          </div>
          
          
        </div> 

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-house nav-link-icon"></i> Главная
          </Link>
          <Link to="/objects" className={`nav-link ${isActive('/objects')}`} onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-building nav-link-icon"></i> Объекты
          </Link>
          <Link to="/services" className={`nav-link ${isActive('/services')}`} onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-toolbox nav-link-icon"></i> Услуги
          </Link>
          <Link to="/contacts" className={`nav-link ${isActive('/contacts')}`} onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-phone nav-link-icon"></i> Контакты
          </Link>
          <Link to="/admin" className="nav-link admin-link" onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-lock"></i> Админ
          </Link>
        </div>

       
      </div>
    </nav>
  );
}


export default Navbar;