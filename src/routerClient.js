const axios = require('axios');

const BASE = process.env.ROUTER_BASE_URL;
const USER = process.env.ROUTER_USERNAME;
const PASS = process.env.ROUTER_PASSWORD;

if (!BASE) console.warn('ROUTER_BASE_URL not set - router integration will fail until configured');

const client = axios.create({ baseURL: BASE, timeout: 5000 });

// Simple auth: if username/password provided, use Basic Auth
if (USER && PASS) {
  client.defaults.auth = { username: USER, password: PASS };
}

module.exports = {
  get: async (path) => {
    const res = await client.get(path);
    return res.data;
  },
  post: async (path, data) => {
    const res = await client.post(path, data);
    return res.data;
  },
  getStatus: async () => {
    // Try common endpoints; this is a best-effort function — routers differ muito
    const candidates = ['/status', '/api/status', '/wifi/status', '/system/status'];
    for (const p of candidates) {
      try {
        const r = await client.get(p);
        return r.data;
      } catch (e) {
        // continue
      }
    }
    throw new Error('no status endpoint responded');
  }
};
