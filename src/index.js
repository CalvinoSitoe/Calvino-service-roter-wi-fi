const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const auth = require('./auth');
const routerClient = require('./routerClient');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth routes
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  try {
    const user = db.getUserByUsername(username);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const valid = await auth.verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ error: 'invalid credentials' });

    const token = auth.signToken({ id: user.id, username: user.username });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.json({ message: 'logged in' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'logged out' });
});

// Protected wifi endpoints
app.get('/api/wifi/status', auth.jwtMiddleware, async (req, res) => {
  try {
    const status = await routerClient.getStatus();
    res.json({ status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to get status' });
  }
});

app.post('/api/wifi/command', auth.jwtMiddleware, async (req, res) => {
  const { action, data } = req.body || {};
  const whitelist = ['status', 'restart_wifi', 'reboot_router', 'list_clients', 'set_ssid', 'set_password'];
  if (!action || !whitelist.includes(action)) return res.status(400).json({ error: 'invalid action' });

  try {
    let result;
    switch (action) {
      case 'status':
        result = await routerClient.getStatus();
        break;
      case 'restart_wifi':
        result = await routerClient.post('/wifi/restart', data);
        break;
      case 'reboot_router':
        result = await routerClient.post('/system/reboot', data);
        break;
      case 'list_clients':
        result = await routerClient.get('/wifi/clients');
        break;
      case 'set_ssid':
        result = await routerClient.post('/wifi/ssid', { ssid: data && data.ssid });
        break;
      case 'set_password':
        result = await routerClient.post('/wifi/password', { password: data && data.password });
        break;
      default:
        return res.status(400).json({ error: 'unsupported action' });
    }
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'command failed' });
  }
});

// Serve frontend (static files in public)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
