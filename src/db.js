const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'database.sqlite');

const db = new sqlite3.Database(DB_PATH);

// Initialize tables if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = {
  run: (sql, params=[]) => new Promise((resolve, reject) => db.run(sql, params, function(err){ if(err) reject(err); else resolve(this); })),
  get: (sql, params=[]) => new Promise((resolve, reject) => db.get(sql, params, (err, row) => { if(err) reject(err); else resolve(row); })),
  all: (sql, params=[]) => new Promise((resolve, reject) => db.all(sql, params, (err, rows) => { if(err) reject(err); else resolve(rows); })),
  close: () => db.close(),
  // helper for auth
  getUserByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
};
