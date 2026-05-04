import { useState } from 'react';

function Contacts() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(() => {
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setForm({ name: '', phone: '', email: '', message: '' });
    });
  };

  return (
    <div className="page contacts-page">
      <div className="page-hero">
        <div className="page-hero-overlay"></div>
        <h1>Контакты</h1>
        <p>Свяжитесь с нами удобным способом</p>
      </div>
      <section className="container contact-layout">
        <div className="contact-info-sidebar">
          <div className="contact-card">
            <i className="fa-solid fa-phone"></i>
            <h3>Телефон</h3>
            <p>+7 (952) 123-45-67</p>
          </div>
          <div className="contact-card">
            <i className="fa-solid fa-envelope"></i>
            <h3>Email</h3>
            <p>info@galaktika-build.ru</p>
          </div>
          <div className="contact-card">
            <i className="fa-solid fa-location-dot"></i>
            <h3>Офис</h3>
            <p>Москва, ул. Строителей, 15</p>
          </div>
        </div>
        <form className="contact-form-main" onSubmit={handleSubmit}>
          <h2>Оставить заявку</h2>
          <input type="text" placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="tel" placeholder="Ваш телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input type="email" placeholder="Ваш email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <textarea placeholder="Опишите ваш проект..." rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}></textarea>
          <button type="submit" className="btn-primary">Отправить заявку</button>
          {sent && <p className="success-msg">Заявка отправлена!</p>}
        </form>
      </section>
    </div>
  );
}

export default Contacts;