const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Подключение к базе данных
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к БД:', err.message);
    } else {
        console.log('✅ Подключено к SQLite');
        createTables();
    }
});

// Создание всех таблиц
function createTables() {
    // Таблица заявок
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        message TEXT,
        status TEXT DEFAULT 'Новая',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Ошибка создания таблицы contacts:', err.message);
        } else {
            console.log('✅ Таблица contacts готова');
        }
    });

    // Таблица сотрудников
    db.run(`CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT,
        age INTEGER,
        gender TEXT,
        address TEXT,
        phone TEXT,
        passport TEXT,
        position_id INTEGER
    )`);

    // Таблица должностей
    db.run(`CREATE TABLE IF NOT EXISTS positions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        salary INTEGER,
        duties TEXT,
        requirements TEXT
    )`);

    // Таблица видов работ
    db.run(`CREATE TABLE IF NOT EXISTS work_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price INTEGER,
        material1_id INTEGER,
        material2_id INTEGER,
        material3_id INTEGER
    )`);

    // Таблица материалов
    db.run(`CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        packaging TEXT,
        description TEXT,
        price INTEGER
    )`);

    // Таблица бригад
    db.run(`CREATE TABLE IF NOT EXISTS brigades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee1_id INTEGER,
        employee2_id INTEGER,
        employee3_id INTEGER
    )`);

    // Таблица заказчиков
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT,
        address TEXT,
        phone TEXT,
        passport TEXT
    )`);

    // Таблица заказов
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        work_type_id INTEGER,
        brigade_id INTEGER,
        cost INTEGER,
        start_date TEXT,
        end_date TEXT,
        completed INTEGER DEFAULT 0,
        paid INTEGER DEFAULT 0,
        employee_id INTEGER
    )`);
}

// ============================================================
// МАРШРУТЫ ДЛЯ ЗАЯВОК
// ============================================================

// Получить все заявки
app.get('/api/contacts', (req, res) => {
    const { status } = req.query;
    let sql = 'SELECT * FROM contacts';
    const params = [];
    
    if (status && status !== 'all') {
        sql += ' WHERE status = ?';
        params.push(status);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Ошибка получения заявок:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// Создать новую заявку
app.post('/api/contacts', (req, res) => {
    const { name, phone, email, message, status } = req.body;
    
    if (!name || !phone) {
        return res.status(400).json({ error: 'Имя и телефон обязательны' });
    }
    
    const sql = 'INSERT INTO contacts (name, phone, email, message, status) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [name, phone, email || '', message || '', status || 'Новая'], function(err) {
        if (err) {
            console.error('Ошибка создания заявки:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Заявка создана', success: true });
    });
});

// Обновить заявку
app.put('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates).filter(k => updates[k] !== undefined);
    if (fields.length === 0) {
        return res.status(400).json({ error: 'Нет данных для обновления' });
    }
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => updates[f]);
    values.push(id);
    
    const sql = `UPDATE contacts SET ${setClause} WHERE id = ?`;
    db.run(sql, values, function(err) {
        if (err) {
            console.error('Ошибка обновления заявки:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Заявка обновлена', success: true });
    });
});

// Удалить заявку
app.delete('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM contacts WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Ошибка удаления заявки:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Заявка удалена', success: true });
    });
});

// ============================================================
// УНИВЕРСАЛЬНЫЕ МАРШРУТЫ ДЛЯ ТАБЛИЦ
// ============================================================

// Получить все записи
app.get('/api/table/:tableName', (req, res) => {
    const { tableName } = req.params;
    const allowedTables = ['employees', 'positions', 'work_types', 'materials', 'brigades', 'customers', 'orders', 'contacts'];
    
    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ error: 'Недопустимое имя таблицы' });
    }
    
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
        if (err) {
            console.error(`Ошибка получения ${tableName}:`, err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// Создать запись
app.post('/api/table/:tableName', (req, res) => {
    const { tableName } = req.params;
    const data = req.body;
    const allowedTables = ['employees', 'positions', 'work_types', 'materials', 'brigades', 'customers', 'orders', 'contacts'];
    
    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ error: 'Недопустимое имя таблицы' });
    }
    
    const fields = Object.keys(data);
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map(f => data[f]);
    
    db.run(`INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`, values, function(err) {
        if (err) {
            console.error(`Ошибка создания в ${tableName}:`, err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, success: true });
    });
});

// Обновить запись
app.put('/api/table/:tableName/:id', (req, res) => {
    const { tableName, id } = req.params;
    const updates = req.body;
    const allowedTables = ['employees', 'positions', 'work_types', 'materials', 'brigades', 'customers', 'orders', 'contacts'];
    
    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ error: 'Недопустимое имя таблицы' });
    }
    
    const fields = Object.keys(updates).filter(k => updates[k] !== undefined);
    if (fields.length === 0) {
        return res.status(400).json({ error: 'Нет данных для обновления' });
    }
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => updates[f]);
    values.push(id);
    
    db.run(`UPDATE ${tableName} SET ${setClause} WHERE id = ?`, values, function(err) {
        if (err) {
            console.error(`Ошибка обновления в ${tableName}:`, err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

// Удалить запись
app.delete('/api/table/:tableName/:id', (req, res) => {
    const { tableName, id } = req.params;
    const allowedTables = ['employees', 'positions', 'work_types', 'materials', 'brigades', 'customers', 'orders', 'contacts'];
    
    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ error: 'Недопустимое имя таблицы' });
    }
    
    db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id], function(err) {
        if (err) {
            console.error(`Ошибка удаления из ${tableName}:`, err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
});