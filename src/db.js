'use strict';

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = process.env.DB_PATH || './database.sqlite';

const dbPromise = open({
  filename: DB_PATH,
  driver: sqlite3.Database
});

async function initDB() {
  const db = await dbPromise;

  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      createdAt TEXT
    )
  `);

  // Create News table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id TEXT PRIMARY KEY,
      image TEXT,
      date TEXT,
      title TEXT,
      text TEXT,
      amethyst TEXT,
      createdAt TEXT
    )
  `);

  // Create Applications table (for services)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      userId TEXT,
      serviceId TEXT,
      serviceTitle TEXT,
      serviceCategory TEXT,
      formData TEXT,
      status TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  // Create Citizens table (for citizenship/service requests)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS citizens (
      id TEXT PRIMARY KEY,
      type TEXT,
      nickname TEXT,
      age TEXT,
      city TEXT,
      wish TEXT,
      status TEXT,
      createdAt TEXT
    )
  `);

  // Seed default admin if not exists
  const admin = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!admin) {
    const hashedPassword = await bcrypt.hash('ken123', 10);
    await db.run(
      'INSERT INTO users (id, username, password, role, createdAt) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), 'admin', hashedPassword, 'admin', new Date().toISOString()]
    );
    console.log('Default admin account created (admin / ken123)');
  }

  // Seed initial news if table is empty
  const newsCount = await db.get('SELECT COUNT(*) as count FROM news');
  if (newsCount.count === 0) {
    const initialNews = [
      {
        id: '1',
        image: '/images/news8.jpg',
        date: 'СВЕЖЕЕ',
        title: '❗️Кендрессии Все Должны❗️',
        text: 'В Кендуме заявили, что Кендрессия — единственная страна, которая занималась инфраструктурой на спавне. «СТО СОРОК МИЛЛИАРДОВ АЛМАЗОВ! НА СТАТУИ ПОТРАТИЛИ! НА ФИГУЛЬКИ! А НА СПАВНЕ ЧТО?! ПУСТОТА!» — В. В. Кенриновский.',
        amethyst: 'АметистNews',
        createdAt: '2026-02-01T00:00:00Z'
      },
      {
        id: '2',
        image: '/images/news9.jpg',
        date: 'СВЕЖЕЕ',
        title: '❗️Страны союзники отказываются платить свои долги❗️',
        text: 'Внешний долг Дмитрий составляет уже более двухсот пятидесяти Золота 🌕',
        amethyst: 'АметистNews',
        createdAt: '2026-02-05T00:00:00Z'
      },
      {
        id: '3',
        image: '/images/news10.jpg',
        date: 'СВЕЖЕЕ',
        title: '❗️ВсеКендрийская революция❗️',
        text: 'КенФлиш больше не правитель СПБ. С этого дня главным органом власти является «КГБ СПБ». Состав КГБ СПБ: Кен Флиш. Вступление в КГБ СПБ рассматривает Кен Флиш.',
        amethyst: 'АметистNews',
        createdAt: '2026-02-10T00:00:00Z'
      },
      {
        id: '4',
        image: '/images/news11.jpg',
        date: 'СВЕЖЕЕ',
        title: '❗️Враги СПБ продолжают снимать пропагандистские видеоролики❗️',
        text: 'Пропаганда продолжает распространяться. Государство принимает меры.',
        amethyst: 'АметистNews',
        createdAt: '2026-02-15T00:00:00Z'
      },
      {
        id: '5',
        image: '/images/news12.jpg',
        date: '25.10.2025',
        title: 'В КенДуме',
        text: 'Депутат Вольдемар326 предложил новый законопроект.',
        amethyst: 'АметистNews',
        createdAt: '2025-10-25T00:00:00Z'
      }
    ];
    for (const n of initialNews) {
      await db.run(
        'INSERT INTO news (id, image, date, title, text, amethyst, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [n.id, n.image, n.date, n.title, n.text, n.amethyst, n.createdAt]
      );
    }
    console.log('Initial news seeded');
  }

  console.log('Database initialized');
  return db;
}

// Call init on startup
initDB().catch(err => console.error('DB Init Error:', err));

module.exports = dbPromise;
