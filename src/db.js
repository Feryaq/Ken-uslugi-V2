'use strict';

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dbPromise = open({
  filename: './database.sqlite',
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
    const initialNews = require('./data/news'); // get from old in-memory
    for (const n of initialNews) {
      await db.run(
        'INSERT INTO news (id, image, date, title, text, amethyst, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [n.id || uuidv4(), n.image, n.date, n.title, n.text, n.amethyst, n.createdAt || new Date().toISOString()]
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
