import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Страница входа в админ-панель
 */
function AdminLogin() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Простая проверка (в реальном проекте — запрос к серверу)
    if (login === 'admin' && password === 'pandych123') {
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin-panel');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="page admin-page">
      <div className="login-box">
        <h1>
          <i className="fa-solid fa-lock"></i> Вход в систему
        </h1>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            <i className="fa-solid fa-right-to-bracket"></i> Войти
          </button>
        </form>
        
        {error && <p className="error-msg">{error}</p>}
        
        <a href="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Вернуться на сайт
        </a>
      </div>
    </div>
  );
}

export default AdminLogin;