const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const TOKEN_EXP = '8h';

module.exports = {
  signToken: (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXP }),
  verifyToken: (token) => jwt.verify(token, JWT_SECRET),
  jwtMiddleware: (req, res, next) => {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(401).json({ error: 'unauthenticated' });
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      return res.status(401).json({ error: 'invalid token' });
    }
  },
  hashPassword: (plain) => bcrypt.hash(plain, 12),
  verifyPassword: (plain, hash) => bcrypt.compare(plain, hash),
};
