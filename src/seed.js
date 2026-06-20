const db = require('./db');
const auth = require('./auth');

async function seedAdmin() {
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    console.error('ADMIN_USER and ADMIN_PASSWORD must be set to seed admin');
    process.exit(1);
  }

  const existing = await db.get('SELECT * FROM users WHERE username = ?', [ADMIN_USER]);
  if (existing) {
    console.log('Admin user already exists, skipping');
    process.exit(0);
  }

  const hash = await auth.hashPassword(ADMIN_PASSWORD);
  await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [ADMIN_USER, hash]);
  console.log('Admin user created');
  process.exit(0);
}

seedAdmin().catch(err => { console.error(err); process.exit(1); });
