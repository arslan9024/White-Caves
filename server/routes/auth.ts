/**
 * Authentication Routes
 * Single Purpose: Route mapping & middleware attachment.
 * All endpoint business logic is decomposed into server/controllers/auth/.
 */

import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { requireDoubleSubmitCsrf } from '../middleware/csrf.js';
import rateLimiters from '../middleware/rateLimiter.js';

import {
  loginHandler,
  registerHandler,
  logoutHandler,
  refreshHandler,
  getProfileHandler,
  patchProfileHandler,
  verify2faHandler,
  setup2faHandler,
  enable2faHandler,
  disable2faHandler,
  status2faHandler,
  firebaseSyncHandler,
  completeSocialRegistrationHandler,
  forgotPasswordRequestHandler,
  forgotPasswordVerifyHandler,
  forgotPasswordResetHandler,
  changePasswordHandler,
  getLoginAttemptsHandler,
  unlockAccountHandler,
  unlockIpHandler,
  getActiveLockoutsHandler,
  getSecurityStatsHandler,
  webauthnRegisterOptionsHandler,
  webauthnRegisterVerifyHandler,
  webauthnAuthenticateOptionsHandler,
  webauthnAuthenticateVerifyHandler,
  webauthnDeleteCredentialHandler,
} from '../controllers/auth/index.js';

const {
  authLimiter,
  registerLimiter,
  passwordLimiter,
  strictLimiter,
} = rateLimiters;

const router = Router();

// ─── Authentication & Session ──────────────────────────────────────────────
router.post('/login', authLimiter, loginHandler);
router.post('/register', registerLimiter, registerHandler);
router.post('/logout', authMiddleware, requireDoubleSubmitCsrf, logoutHandler);
router.post('/refresh', requireDoubleSubmitCsrf, refreshHandler);

// ─── User Profile ──────────────────────────────────────────────────────────
router.get('/profile', authMiddleware, getProfileHandler);
router.patch('/profile', authMiddleware, patchProfileHandler);

  // ─── Two-Factor Authentication ─────────────────────────────────────────────
  router.post('/verify-2fa', strictLimiter, verify2faHandler);
  router.post('/2fa/setup', authMiddleware, setup2faHandler);
  router.post('/2fa/enable', authMiddleware, enable2faHandler);
  router.post('/2fa/disable', authMiddleware, disable2faHandler);
  router.get('/2fa/status', authMiddleware, status2faHandler);

  // ─── Firebase & Social Auth ────────────────────────────────────────────────
  router.post('/firebase-sync', firebaseSyncHandler);
  router.post('/complete-social-registration', authMiddleware, completeSocialRegistrationHandler);

// ─── Password Reset & Management ───────────────────────────────────────────
router.post('/forgot-password/request', passwordLimiter, forgotPasswordRequestHandler);
router.post('/forgot-password/verify', passwordLimiter, forgotPasswordVerifyHandler);
router.post('/forgot-password/reset', forgotPasswordResetHandler);
router.put('/password', authMiddleware, changePasswordHandler);

// ─── Security, Lockouts & Auditing ─────────────────────────────────────────
router.get('/security/login-attempts', authMiddleware, getLoginAttemptsHandler);
router.post('/security/unlock', authMiddleware, unlockAccountHandler);
router.post('/security/unlock-ip', authMiddleware, unlockIpHandler);
router.get('/security/active-lockouts', authMiddleware, getActiveLockoutsHandler);
router.get('/security/stats', authMiddleware, getSecurityStatsHandler);

// ─── WebAuthn / FIDO2 Biometrics ───────────────────────────────────────────
router.post('/webauthn/register/options', authMiddleware, webauthnRegisterOptionsHandler);
router.post('/webauthn/register/verify', authMiddleware, webauthnRegisterVerifyHandler);
router.post('/webauthn/authenticate/options', webauthnAuthenticateOptionsHandler);
router.post('/webauthn/authenticate/verify', webauthnAuthenticateVerifyHandler);
router.delete('/webauthn/credentials/:userId/:credentialId', authMiddleware, webauthnDeleteCredentialHandler);

export default router;
