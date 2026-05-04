import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================
// КОНФИГУРАЦИЯ
// ============================================================
const API = 'http://localhost:5000/api';

// ============================================================
// ГЛАВНЫЙ КОМПОНЕНТ: Панель администратора
// ============================================================
function AdminPanel() {
  const [activeTab, setActiveTab] = useState('requests');
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    navigate('/');
  };

  const TABS = [
    { id: 'requests',  label: '📋 Заявки',          icon: 'fa-envelope-open-text' },
    { id: 'hr',        label: '👥 Отдел кадров',    icon: 'fa-users' },
    { id: 'works',     label: '🔧 Список работ',    icon: 'fa-toolbox' },
    { id: 'brigades',  label: '⛑️ Бригады',         icon: 'fa-helmet-safety' },
    { id: 'orders',    label: '📄 Заказы',          icon: 'fa-file-contract' },
    { id: 'tables',    label: '🗄️ Таблицы БД',      icon: 'fa-database' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'requests':  return <RequestsList />;
      case 'hr':        return <HRDepartment />;
      case 'works':     return <WorksList />;
      case 'brigades':  return <BrigadesList />;
      case 'orders':    return <OrdersList />;
      case 'tables':    return <DatabaseTables />;
      default:          return <p className="empty-state">Выберите раздел</p>;
    }
  };

  return (
    <div className="admin-panel-page">
      <div className="admin-panel-container">
        
        <div className="admin-header">
          <h1>панель управления администратора</h1>
          <button onClick={handleLogout} className="btn-logout">
            <i className="fa-solid fa-right-from-bracket"></i> Выйти
          </button>
        </div>

        <div className="admin-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-content">
          {renderTabContent()}
        </div>

      </div>
    </div>
  );
}

// ============================================================
// КОМПОНЕНТ ФОРМЫ
// ============================================================
function CrudForm({ title, fields, labels, initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialData || {});

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      <h4>{title}</h4>
      <div className="form-grid">
        {fields.map(field => (
          <div key={field} className="form-field">
            <label>{labels[field] || field}</label>
            {field === 'gender' ? (
              <select value={form[field] || ''} onChange={e => handleChange(field, e.target.value)}>
                <option value="">Выберите пол</option>
                <option value="М">Мужской</option>
                <option value="Ж">Женский</option>
              </select>
            ) : field === 'completed' || field === 'paid' ? (
              <select value={form[field] || '0'} onChange={e => handleChange(field, e.target.value)}>
                <option value="0">Нет</option>
                <option value="1">Да</option>
              </select>
            ) : field === 'status' ? (
              <select value={form[field] || 'Новая'} onChange={e => handleChange(field, e.target.value)}>
                <option value="Новая">🟠 Новая</option>
                <option value="В обработке">🔵 В обработке</option>
                <option value="Закрыта">✅ Закрыта</option>
              </select>
            ) : field === 'message' ? (
              <textarea
                placeholder={labels[field]}
                value={form[field] || ''}
                onChange={e => handleChange(field, e.target.value)}
                rows="4"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: '#0a0f1a',
                  border: '1px solid rgba(192, 132, 252, 0.2)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            ) : (
              <input
                type={['age', 'salary', 'price', 'cost'].includes(field) ? 'number' : 'text'}
                placeholder={labels[field]}
                value={form[field] || ''}
                onChange={e => handleChange(field, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          <i className="fa-solid fa-check"></i> Сохранить
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          <i className="fa-solid fa-times"></i> Отмена
        </button>
      </div>
    </form>
  );
}

// ============================================================
// ЗАЯВКИ С ФОРМЫ КОНТАКТОВ (ГЛАВНАЯ ВКЛАДКА)
// ============================================================
function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const FIELDS = ['name', 'phone', 'email', 'message', 'status'];
  const LABELS = {
    name: 'Имя',
    phone: 'Телефон',
    email: 'Email',
    message: 'Описание проекта',
    status: 'Статус заявки'
  };

  const loadRequests = () => {
    setLoading(true);
    let url = `${API}/contacts`;
    if (statusFilter !== 'all') url += `?status=${statusFilter}`;
    fetch(url)
      .then(r => r.json())
      .then(d => { 
        setRequests(d); 
        setLoading(false); 
      })
      .catch(err => { 
        console.error('Ошибка загрузки заявок:', err); 
        setLoading(false); 
      });
  };

  useEffect(() => { 
    loadRequests(); 
  }, [statusFilter]);

  const handleAdd = () => {
    setFormData({ status: 'Новая' });
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (req) => {
    const data = {};
    FIELDS.forEach(f => { 
      data[f] = req[f] || ''; 
    });
    setFormData(data);
    setEditId(req.id);
    setShowForm(true);
  };

  const handleSave = (data) => {
    const url = editId ? `${API}/contacts/${editId}` : `${API}/contacts`;
    fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(() => {
        loadRequests();
        setShowForm(false);
        setEditId(null);
      })
      .catch(err => console.error('Ошибка сохранения:', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('❓ Удалить заявку?')) return;
    fetch(`${API}/contacts/${id}`, { method: 'DELETE' })
      .then(() => loadRequests())
      .catch(err => console.error('Ошибка удаления:', err));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`${API}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      loadRequests();
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      alert('Ошибка при обновлении статуса');
    }
  };

 // Форматирование даты с +3 часа
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 3);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

  const getStatusColor = (status) => {
    switch(status) {
      case 'Новая': return '🆕';
      case 'В обработке': return '⚙️';
      case 'Закрыта': return '✅';
      default: return '⚪';
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2><i className="fa-solid fa-envelope-open-text"></i> 📬 Заявки с сайта</h2>
        <button onClick={handleAdd} className="btn-add">
          <i className="fa-solid fa-plus"></i> Добавить заявку вручную
        </button>
      </div>

      <div className="admin-filters">
        <button 
          className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} 
          onClick={() => setStatusFilter('all')}
        >
          📋 Все ({requests.length})
        </button>
        <button 
          className={`filter-btn ${statusFilter === 'Новая' ? 'active' : ''}`} 
          onClick={() => setStatusFilter('Новая')}
        >
          🆕 Новые ({requests.filter(r => r.status === 'Новая').length})
        </button>
        <button 
          className={`filter-btn ${statusFilter === 'В обработке' ? 'active' : ''}`} 
          onClick={() => setStatusFilter('В обработке')}
        >
          ⚙️ В обработке ({requests.filter(r => r.status === 'В обработке').length})
        </button>
        <button 
          className={`filter-btn ${statusFilter === 'Закрыта' ? 'active' : ''}`} 
          onClick={() => setStatusFilter('Закрыта')}
        >
          ✅ Закрытые ({requests.filter(r => r.status === 'Закрыта').length})
        </button>
      </div>

      {showForm && (
        <CrudForm
          title={editId ? '✏️ Редактировать заявку' : '➕ Новая заявка'}
          fields={FIELDS} 
          labels={LABELS} 
          initialData={formData}
          onSave={handleSave} 
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="action-bar">
        <div className="stats-info">
          <span className="stat-badge">📋 Всего: <strong>{requests.length}</strong></span>
          <span className="stat-badge stat-new">🆕 Новых: <strong>{requests.filter(r => r.status === 'Новая').length}</strong></span>
          <span className="stat-badge stat-progress">⚙️ В работе: <strong>{requests.filter(r => r.status === 'В обработке').length}</strong></span>
          <span className="stat-badge stat-closed">✅ Закрыто: <strong>{requests.filter(r => r.status === 'Закрыта').length}</strong></span>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка заявок...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>№</th>
                <th>📅 Дата и время</th>
                <th>👤 Имя</th>
                <th>📞 Телефон</th>
                <th>📧 Email</th>
                <th>💬 Сообщение</th>
                <th>🎯  Статус заявки</th>
                <th>⚡ Действия</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    📭 Нет заявок
                    <br />
                    <small>Заявки из формы контактов появятся здесь автоматически</small>
                  </td>
                </tr>
              ) : (
                requests.map((req, index) => (
                  <tr key={req.id} className={`status-row status-${req.status}`}>
                    <td><strong>{index + 1}</strong></td>
                    <td>{formatDate(req.created_at)}</td>
                    <td><strong>{req.name}</strong></td>
                    <td>
                      {req.phone ? (
                        <a href={`tel:${req.phone}`} className="phone-link">{req.phone}</a>
                      ) : '—'}
                    </td>
                    <td>
                      {req.email ? (
                        <a href={`mailto:${req.email}`} className="email-link">{req.email}</a>
                      ) : '—'}
                    </td>
                    <td className="message-preview" title={req.message}>
                      {req.message ? (
                        req.message.length > 60 ? req.message.substring(0, 60) + '...' : req.message
                      ) : '—'}
                    </td>
                    <td>
                      <select 
                        className={`status-select status-${req.status}`}
                        value={req.status || 'Новая'}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      >
                        <option value="Новая">{getStatusColor('Новая')} Новая</option>
                        <option value="В обработке">{getStatusColor('В обработке')} В обработке</option>
                        <option value="Закрыта">{getStatusColor('Закрыта')} Закрыта</option>
                      </select>
                    </td>
                    <td className="action-buttons">
                      <button onClick={() => handleEdit(req)} className="btn-icon" title="Редактировать">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button onClick={() => handleDelete(req.id)} className="btn-icon btn-delete" title="Удалить">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ОТДЕЛ КАДРОВ
// ============================================================
function HRDepartment() {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const FIELDS = ['full_name', 'age', 'gender', 'address', 'phone', 'passport', 'position_id'];
  const LABELS = {
    full_name: 'ФИО', age: 'Возраст', gender: 'Пол', address: 'Адрес',
    phone: 'Телефон', passport: 'Паспортные данные', position_id: 'Код должности'
  };

  const loadEmployees = () => {
    setLoading(true);
    let url = `${API}/table/employees`;
    if (selectedPosition !== 'all') url += `?position=${selectedPosition}`;
    fetch(url).then(r => r.json()).then(d => { setEmployees(d); setLoading(false); });
  };

  useEffect(() => { loadEmployees(); }, [selectedPosition]);
  useEffect(() => {
    fetch(`${API}/table/positions`).then(r => r.json()).then(setPositions);
  }, []);

  const handleAdd = () => { setFormData({}); setEditId(null); setShowForm(true); };
  const handleEdit = (emp) => {
    const data = {};
    FIELDS.forEach(f => { data[f] = emp[f] || ''; });
    setFormData(data);
    setEditId(emp.id);
    setShowForm(true);
  };
  const handleSave = (data) => {
    const url = editId ? `${API}/table/employees/${editId}` : `${API}/table/employees`;
    fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => {
      loadEmployees();
      setShowForm(false);
      setEditId(null);
    });
  };
  const handleDelete = (id) => {
    if (!window.confirm('Удалить сотрудника?')) return;
    fetch(`${API}/table/employees/${id}`, { method: 'DELETE' }).then(loadEmployees);
  };

  return (
    <div>
      <div className="section-header">
        <h2><i className="fa-solid fa-users"></i> Отдел кадров</h2>
        <button onClick={handleAdd} className="btn-add">
          <i className="fa-solid fa-plus"></i> Добавить сотрудника
        </button>
      </div>
      <div className="admin-filters">
        <button className={`filter-btn ${selectedPosition === 'all' ? 'active' : ''}`} 
          onClick={() => setSelectedPosition('all')}>Все должности</button>
        {positions.map(pos => (
          <button key={pos.id} className={`filter-btn ${selectedPosition === pos.id ? 'active' : ''}`} 
            onClick={() => setSelectedPosition(pos.id)}>{pos.name}</button>
        ))}
      </div>
      {showForm && (
        <CrudForm
          title={editId ? 'Редактировать сотрудника' : 'Новый сотрудник'}
          fields={FIELDS} labels={LABELS} initialData={formData}
          onSave={handleSave} onCancel={() => setShowForm(false)}
        />
      )}
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div><p>Загрузка...</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>ID</th><th>ФИО</th><th>Возраст</th><th>Пол</th><th>Телефон</th><th>Должность</th><th>Действия</th></tr></thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td><strong>{emp.full_name}</strong></td>
                  <td>{emp.age}</td>
                  <td>{emp.gender === 'М' ? 'Мужской' : 'Женский'}</td>
                  <td>{emp.phone || '—'}</td>
                  <td>{emp.position_name || emp.position_id}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(emp)} className="btn-icon"><i className="fa-solid fa-pen"></i></button>
                    <button onClick={() => handleDelete(emp.id)} className="btn-icon btn-delete"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// СПИСОК РАБОТ
// ============================================================
function WorksList() {
  const [works, setWorks] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const FIELDS = ['name', 'description', 'price', 'material1_id', 'material2_id', 'material3_id'];
  const LABELS = {
    name: 'Наименование', description: 'Описание', price: 'Цена работы',
    material1_id: 'Материал 1 (ID)', material2_id: 'Материал 2 (ID)', material3_id: 'Материал 3 (ID)'
  };

  const loadWorks = () => {
    setLoading(true);
    fetch(`${API}/table/work_types`).then(r => r.json()).then(d => { setWorks(d); setLoading(false); });
  };

  useEffect(() => { loadWorks(); }, []);
  useEffect(() => {
    fetch(`${API}/table/materials`).then(r => r.json()).then(setMaterials);
  }, []);

  const handleAdd = () => { setFormData({}); setEditId(null); setShowForm(true); };
  const handleEdit = (work) => {
    const data = {};
    FIELDS.forEach(f => { data[f] = work[f] || ''; });
    setFormData(data);
    setEditId(work.id);
    setShowForm(true);
  };
  const handleSave = (data) => {
    const url = editId ? `${API}/table/work_types/${editId}` : `${API}/table/work_types`;
    fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => { loadWorks(); setShowForm(false); setEditId(null); });
  };
  const handleDelete = (id) => {
    if (!window.confirm('Удалить вид работы?')) return;
    fetch(`${API}/table/work_types/${id}`, { method: 'DELETE' }).then(loadWorks);
  };

  return (
    <div>
      <div className="section-header">
        <h2><i className="fa-solid fa-toolbox"></i> Список работ</h2>
        <button onClick={handleAdd} className="btn-add"><i className="fa-solid fa-plus"></i> Добавить работу</button>
      </div>
      <div className="reference-info">
        <p><i className="fa-solid fa-info-circle"></i> Доступные материалы: {materials.map(m => `#${m.id} — ${m.name}`).join(', ')}</p>
      </div>
      {showForm && (
        <CrudForm
          title={editId ? 'Редактировать работу' : 'Новая работа'}
          fields={FIELDS} labels={LABELS} initialData={formData}
          onSave={handleSave} onCancel={() => setShowForm(false)}
        />
      )}
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div><p>Загрузка...</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Наименование</th><th>Цена</th><th>Материалы</th><th>Действия</th></tr></thead>
            <tbody>
              {works.map(work => (
                <tr key={work.id}>
                  <td>{work.id}</td>
                  <td><strong>{work.name}</strong></td>
                  <td>{work.price ? `${work.price} ₽` : '—'}</td>
                  <td>{work.material1_id || '—'}, {work.material2_id || '—'}, {work.material3_id || '—'}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(work)} className="btn-icon"><i className="fa-solid fa-pen"></i></button>
                    <button onClick={() => handleDelete(work.id)} className="btn-icon btn-delete"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// СПИСОК БРИГАД
// ============================================================
function BrigadesList() {
  const [brigades, setBrigades] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const FIELDS = ['employee1_id', 'employee2_id', 'employee3_id'];
  const LABELS = {
    employee1_id: 'Бригадир (ID сотрудника)',
    employee2_id: 'Сотрудник 2 (ID)',
    employee3_id: 'Сотрудник 3 (ID)'
  };

  const loadBrigades = () => {
    setLoading(true);
    fetch(`${API}/table/brigades`).then(r => r.json()).then(d => { setBrigades(d); setLoading(false); });
  };

  useEffect(() => {
    loadBrigades();
    fetch(`${API}/table/employees`).then(r => r.json()).then(setEmployees);
  }, []);

  const handleAdd = () => { setFormData({}); setEditId(null); setShowForm(true); };
  const handleEdit = (brigade) => {
    const data = {};
    FIELDS.forEach(f => { data[f] = brigade[f] || ''; });
    setFormData(data);
    setEditId(brigade.id);
    setShowForm(true);
  };
  const handleSave = (data) => {
    const url = editId ? `${API}/table/brigades/${editId}` : `${API}/table/brigades`;
    fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => { loadBrigades(); setShowForm(false); setEditId(null); });
  };
  const handleDelete = (id) => {
    if (!window.confirm('Расформировать бригаду?')) return;
    fetch(`${API}/table/brigades/${id}`, { method: 'DELETE' }).then(loadBrigades);
  };

  return (
    <div>
      <div className="section-header">
        <h2><i className="fa-solid fa-helmet-safety"></i> Бригады</h2>
        <button onClick={handleAdd} className="btn-add"><i className="fa-solid fa-plus"></i> Сформировать бригаду</button>
      </div>
      <div className="reference-info">
        <p><i className="fa-solid fa-info-circle"></i> Доступные сотрудники: {employees.map(e => `#${e.id} — ${e.full_name}`).join(', ')}</p>
      </div>
      {showForm && (
        <CrudForm
          title={editId ? 'Редактировать бригаду' : 'Новая бригада'}
          fields={FIELDS} labels={LABELS} initialData={formData}
          onSave={handleSave} onCancel={() => setShowForm(false)}
        />
      )}
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div><p>Загрузка...</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Бригадир</th><th>Сотрудник 2</th><th>Сотрудник 3</th><th>Действия</th></tr></thead>
            <tbody>
              {brigades.map(b => (
                <tr key={b.id}>
                  <td><span className="badge badge-primary">№{b.id}</span></td>
                  <td><strong>{b.employee1_name || b.employee1_id || '—'}</strong></td>
                  <td>{b.employee2_name || b.employee2_id || '—'}</td>
                  <td>{b.employee3_name || b.employee3_id || '—'}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(b)} className="btn-icon"><i className="fa-solid fa-pen"></i></button>
                    <button onClick={() => handleDelete(b.id)} className="btn-icon btn-delete"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// СПИСОК ЗАКАЗОВ
// ============================================================
function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [brigades, setBrigades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);

  const FIELDS = ['customer_id', 'work_type_id', 'brigade_id', 'cost', 'start_date', 'end_date', 'completed', 'paid', 'employee_id'];
  const LABELS = {
    customer_id: 'Заказчик (ID)', work_type_id: 'Работа (ID)', brigade_id: 'Бригада (ID)',
    cost: 'Стоимость', start_date: 'Дата начала', end_date: 'Дата окончания',
    completed: 'Завершён', paid: 'Оплачен', employee_id: 'Ответственный (ID)'
  };

  const loadOrders = () => {
    setLoading(true);
    fetch(`${API}/table/orders`).then(r => r.json()).then(d => { setOrders(d); setLoading(false); });
  };

  useEffect(() => {
    loadOrders();
    fetch(`${API}/table/work_types`).then(r => r.json()).then(setWorkTypes);
    fetch(`${API}/table/customers`).then(r => r.json()).then(setCustomers);
    fetch(`${API}/table/brigades`).then(r => r.json()).then(setBrigades);
  }, []);

  const handleAdd = () => { setFormData({}); setShowForm(true); };
  const handleSave = (data) => {
    fetch(`${API}/table/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => { loadOrders(); setShowForm(false); });
  };
  const handleDelete = (id) => {
    if (!window.confirm('Удалить заказ?')) return;
    fetch(`${API}/table/orders/${id}`, { method: 'DELETE' }).then(loadOrders);
  };

  return (
    <div>
      <div className="section-header">
        <h2><i className="fa-solid fa-file-contract"></i> Список заказов</h2>
        <button onClick={handleAdd} className="btn-add"><i className="fa-solid fa-plus"></i> Добавить заказ</button>
      </div>
      {showForm && (
        <CrudForm
          title="Новый заказ"
          fields={FIELDS} labels={LABELS} initialData={formData}
          onSave={handleSave} onCancel={() => setShowForm(false)}
        />
      )}
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div><p>Загрузка...</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Заказчик</th><th>Работа</th><th>Бригада</th><th>Сумма</th><th>Статус</th><th>Действия</th></tr></thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td><strong>{order.customer_name || order.customer_id}</strong></td>
                  <td>{order.work_name || order.work_type_id}</td>
                  <td>№{order.brigade_id || '—'}</td>
                  <td>{order.cost ? `${order.cost} ₽` : '—'}</td>
                  <td><span className={`badge ${order.completed ? 'badge-green' : 'badge-yellow'}`}>{order.completed ? '✅ Завершён' : '⏳ В работе' }</span></td>
                  <td className="action-buttons">
                    <button onClick={() => handleDelete(order.id)} className="btn-icon btn-delete"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ТАБЛИЦЫ БАЗЫ ДАННЫХ
// ============================================================
function DatabaseTables() {
  const [selectedTable, setSelectedTable] = useState('contacts');
  
  const TABLES = [
    { id: 'contacts',    label: '📬 Заявки',       icon: 'fa-envelope-open-text' },
    { id: 'employees',   label: '👥 Сотрудники',   icon: 'fa-user-tie' },
    { id: 'positions',   label: '📋 Должности',    icon: 'fa-id-card' },
    { id: 'work_types',  label: '🔧 Виды работ',   icon: 'fa-toolbox' },
    { id: 'materials',   label: '📦 Материалы',    icon: 'fa-cubes' },
    { id: 'brigades',    label: '⛑️ Бригады',      icon: 'fa-helmet-safety' },
    { id: 'customers',   label: '👤 Заказчики',    icon: 'fa-address-book' },
    { id: 'orders',      label: '📄 Заказы',       icon: 'fa-file-contract' },
  ];

  return (
    <div>
      <h2><i className="fa-solid fa-database"></i> Таблицы базы данных</h2>
      <div className="admin-tabs small">
        {TABLES.map(table => (
          <button
            key={table.id}
            className={`admin-tab ${selectedTable === table.id ? 'active' : ''}`}
            onClick={() => setSelectedTable(table.id)}
          >
            <i className={`fa-solid ${table.icon}`}></i> {table.label}
          </button>
        ))}
      </div>
      <div className="table-content">
        <EditableTable tableName={selectedTable} />
      </div>
    </div>
  );
}

// ============================================================
// УНИВЕРСАЛЬНАЯ РЕДАКТИРУЕМАЯ ТАБЛИЦА
// ============================================================
function EditableTable({ tableName }) {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const TABLE_CONFIGS = {
    contacts: {
      title: 'Заявки',
      fields: ['name', 'phone', 'email', 'message', 'status'],
      labels: { name: 'Имя', phone: 'Телефон', email: 'Email', message: 'Сообщение', status: 'Статус' }
    },
    employees: {
      title: 'Сотрудники',
      fields: ['full_name', 'age', 'gender', 'address', 'phone', 'passport', 'position_id'],
      labels: { full_name: 'ФИО', age: 'Возраст', gender: 'Пол', address: 'Адрес', phone: 'Телефон', passport: 'Паспорт', position_id: 'Должность (ID)' }
    },
    positions: {
      title: 'Должности',
      fields: ['name', 'salary', 'duties', 'requirements'],
      labels: { name: 'Название', salary: 'Оклад', duties: 'Обязанности', requirements: 'Требования' }
    },
    work_types: {
      title: 'Виды работ',
      fields: ['name', 'description', 'price', 'material1_id', 'material2_id', 'material3_id'],
      labels: { name: 'Название', description: 'Описание', price: 'Цена', material1_id: 'Материал 1', material2_id: 'Материал 2', material3_id: 'Материал 3' }
    },
    materials: {
      title: 'Материалы',
      fields: ['name', 'packaging', 'description', 'price'],
      labels: { name: 'Название', packaging: 'Упаковка', description: 'Описание', price: 'Цена' }
    },
    brigades: {
      title: 'Бригады',
      fields: ['employee1_id', 'employee2_id', 'employee3_id'],
      labels: { employee1_id: 'Сотрудник 1 (ID)', employee2_id: 'Сотрудник 2 (ID)', employee3_id: 'Сотрудник 3 (ID)' }
    },
    customers: {
      title: 'Заказчики',
      fields: ['full_name', 'address', 'phone', 'passport'],
      labels: { full_name: 'ФИО', address: 'Адрес', phone: 'Телефон', passport: 'Паспорт' }
    },
    orders: {
      title: 'Заказы',
      fields: ['customer_id', 'work_type_id', 'brigade_id', 'cost', 'start_date', 'end_date', 'completed', 'paid', 'employee_id'],
      labels: { customer_id: 'Заказчик', work_type_id: 'Работа', brigade_id: 'Бригада', cost: 'Стоимость', start_date: 'Начало', end_date: 'Окончание', completed: 'Завершён', paid: 'Оплачен', employee_id: 'Ответственный' }
    }
  };

  const config = TABLE_CONFIGS[tableName];

  const loadData = () => {
    setLoading(true);
    fetch(`${API}/table/${tableName}`)
      .then(r => r.json())
      .then(d => { 
        setData(d); 
        setLoading(false); 
      })
      .catch(err => { 
        console.error('Ошибка загрузки:', err); 
        setLoading(false); 
      });
  };

  useEffect(() => { 
    if (config) {
      loadData(); 
    }
  }, [tableName]);

  const handleAdd = () => { 
    setFormData({}); 
    setEditId(null); 
    setShowForm(true); 
  };
  
  const handleEdit = (row) => {
    const data = {};
    if (config) {
      config.fields.forEach(f => { 
        data[f] = row[f] !== undefined && row[f] !== null ? row[f] : ''; 
      });
    }
    setFormData(data);
    setEditId(row.id);
    setShowForm(true);
  };
  
  const handleSave = (data) => {
    const url = editId ? `${API}/table/${tableName}/${editId}` : `${API}/table/${tableName}`;
    fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => { 
      loadData(); 
      setShowForm(false); 
      setEditId(null); 
    });
  };
  
  const handleDelete = (id) => {
    if (!window.confirm('Удалить запись?')) return;
    fetch(`${API}/table/${tableName}/${id}`, { method: 'DELETE' })
      .then(() => loadData());
  };

  if (!config) {
    return <p>Таблица не найдена</p>;
  }

  return (
    <div>
      <div className="section-header">
        <h3><i className="fa-solid fa-table"></i> {config.title}</h3>
        <button onClick={handleAdd} className="btn-add">
          <i className="fa-solid fa-plus"></i> Добавить
        </button>
      </div>
      
      {showForm && (
        <CrudForm
          title={editId ? 'Редактировать' : 'Добавить запись'}
          fields={config.fields} 
          labels={config.labels} 
          initialData={formData}
          onSave={handleSave} 
          onCancel={() => setShowForm(false)}
        />
      )}
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                {config.fields.map(f => <th key={f}>{config.labels[f]}</th>)}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={config.fields.length + 2} className="empty-state">
                    Нет данных
                  </td>
                </tr>
              ) : (
                data.map(row => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    {config.fields.map(f => (
                      <td key={f}>
                        {row[f] !== undefined && row[f] !== null ? String(row[f]) : '—'}
                      </td>
                    ))}
                    <td className="action-buttons">
                      <button onClick={() => handleEdit(row)} className="btn-icon" title="Редактировать">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="btn-icon btn-delete" title="Удалить">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;