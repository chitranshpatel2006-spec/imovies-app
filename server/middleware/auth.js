const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided, access denied' });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7, authHeader.length).trim()
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: 'Token format invalid, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026_secured');
    req.user = decoded; // { id, email, role, name }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired', error: err.message });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

module.exports = { auth, adminOnly };
