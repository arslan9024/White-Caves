import jwt from 'jsonwebtoken';
import { verifyIdToken } from '../config/firebaseAdmin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'whitecaves_real_estate_secret_2024';
const JWT_EXPIRES_IN = '7d';

export const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      role: user.role || 'user'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyJWT(token);
  if (decoded) {
    req.user = decoded;
    return next();
  }

  try {
    const firebaseUser = await verifyIdToken(token);
    req.user = {
      id: firebaseUser.uid,
      phone: firebaseUser.phone_number,
      email: firebaseUser.email,
      name: firebaseUser.name
    };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  const decoded = verifyJWT(token);
  if (decoded) {
    req.user = decoded;
  }
  
  next();
};
