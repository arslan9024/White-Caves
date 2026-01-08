import express from 'express';
import UaePassService from '../services/uaePassService.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const uaePassService = new UaePassService();

const pendingSessions = new Map();

const cleanupExpiredSessions = () => {
  const now = Date.now();
  for (const [key, value] of pendingSessions.entries()) {
    if (now - value.createdAt > 10 * 60 * 1000) {
      pendingSessions.delete(key);
    }
  }
};

setInterval(cleanupExpiredSessions, 5 * 60 * 1000);

router.get('/status', (req, res) => {
  res.json({
    configured: uaePassService.isConfigured(),
    environment: process.env.UAEPASS_AUTH_URL?.includes('stg-') ? 'staging' : 'production'
  });
});

router.get('/initiate', (req, res) => {
  try {
    if (!uaePassService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'UAE Pass is not configured. Please contact support.'
      });
    }

    const state = uaePassService.generateState();
    const nonce = uaePassService.generateNonce();
    
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    
    pendingSessions.set(state, {
      nonce,
      isMobile,
      createdAt: Date.now(),
      ip: req.ip
    });
    
    const authUrl = uaePassService.getAuthorizationUrl(state, nonce, isMobile);
    
    const response = {
      success: true,
      authUrl,
      state,
      isMobile
    };
    
    if (isMobile) {
      response.deepLink = uaePassService.getMobileDeepLink(state, nonce);
    }
    
    res.json(response);
  } catch (error) {
    console.error('UAE Pass initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate UAE Pass login'
    });
  }
});

router.get('/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    
    if (error) {
      console.error('UAE Pass callback error:', error, error_description);
      return res.redirect(`/auth/signin?error=${encodeURIComponent(error_description || error)}`);
    }
    
    if (!state || !pendingSessions.has(state)) {
      return res.redirect('/auth/signin?error=Invalid+or+expired+session');
    }
    
    const session = pendingSessions.get(state);
    pendingSessions.delete(state);
    
    if (!code) {
      return res.redirect('/auth/signin?error=Authorization+code+missing');
    }
    
    const tokenResult = await uaePassService.exchangeCodeForTokens(code);
    
    if (!tokenResult.success) {
      return res.redirect(`/auth/signin?error=${encodeURIComponent(tokenResult.error)}`);
    }
    
    const userResult = await uaePassService.getUserInfo(tokenResult.accessToken);
    
    if (!userResult.success) {
      return res.redirect(`/auth/signin?error=${encodeURIComponent(userResult.error)}`);
    }
    
    const uaePassUser = userResult.user;
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return res.redirect('/auth/signin?error=Server+configuration+error');
    }
    
    const authToken = jwt.sign(
      {
        provider: 'uaepass',
        emiratesId: uaePassUser.emiratesId,
        email: uaePassUser.email,
        name: uaePassUser.fullNameEN,
        nameAR: uaePassUser.fullNameAR,
        verified: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.redirect(`/auth/uaepass-success?token=${authToken}`);
    
  } catch (error) {
    console.error('UAE Pass callback error:', error);
    res.redirect('/auth/signin?error=Authentication+failed');
  }
});

router.post('/verify-token', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.provider !== 'uaepass') {
      return res.status(400).json({
        success: false,
        message: 'Invalid token provider'
      });
    }
    
    res.json({
      success: true,
      user: {
        emiratesId: decoded.emiratesId,
        email: decoded.email,
        name: decoded.name,
        nameAR: decoded.nameAR,
        verified: decoded.verified,
        provider: 'uaepass'
      }
    });
    
  } catch (error) {
    console.error('UAE Pass token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

export default router;
