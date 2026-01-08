import express from 'express';
import crypto from 'crypto';

const router = express.Router();

const pendingChallenges = new Map();
const userCredentials = new Map();

const cleanupExpiredChallenges = () => {
  const now = Date.now();
  for (const [key, value] of pendingChallenges.entries()) {
    if (now - value.createdAt > 5 * 60 * 1000) {
      pendingChallenges.delete(key);
    }
  }
};

setInterval(cleanupExpiredChallenges, 60 * 1000);

const generateChallenge = () => {
  return crypto.randomBytes(32).toString('base64url');
};

router.get('/status', async (req, res) => {
  res.json({
    enabled: true,
    rpName: 'White Caves Real Estate',
    rpId: req.hostname,
  });
});

router.post('/register/options', (req, res) => {
  try {
    const { userId, userName, displayName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        success: false,
        message: 'userId and userName are required',
      });
    }

    const challenge = generateChallenge();
    const userIdBuffer = Buffer.from(userId).toString('base64url');

    pendingChallenges.set(userId, {
      challenge,
      type: 'registration',
      createdAt: Date.now(),
    });

    const options = {
      challenge,
      rp: {
        name: 'White Caves Real Estate',
        id: req.hostname === 'localhost' ? 'localhost' : req.hostname,
      },
      user: {
        id: userIdBuffer,
        name: userName,
        displayName: displayName || userName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },
        { alg: -257, type: 'public-key' },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    };

    res.json({
      success: true,
      options,
    });
  } catch (error) {
    console.error('WebAuthn registration options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate registration options',
    });
  }
});

router.post('/register/verify', (req, res) => {
  try {
    const { userId, credential } = req.body;

    if (!userId || !credential) {
      return res.status(400).json({
        success: false,
        message: 'userId and credential are required',
      });
    }

    const pendingChallenge = pendingChallenges.get(userId);
    if (!pendingChallenge || pendingChallenge.type !== 'registration') {
      return res.status(400).json({
        success: false,
        message: 'No pending registration challenge',
      });
    }

    pendingChallenges.delete(userId);

    const existingCredentials = userCredentials.get(userId) || [];
    existingCredentials.push({
      id: credential.id,
      rawId: credential.rawId,
      type: credential.type,
      publicKey: credential.response?.publicKey,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      deviceName: 'This Device',
    });
    userCredentials.set(userId, existingCredentials);

    res.json({
      success: true,
      message: 'Biometric credential registered successfully',
      credentialId: credential.id,
    });
  } catch (error) {
    console.error('WebAuthn registration verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify registration',
    });
  }
});

router.post('/authenticate/options', (req, res) => {
  try {
    const { userId } = req.body;

    const credentials = userId ? userCredentials.get(userId) : null;

    const challenge = generateChallenge();

    if (userId) {
      pendingChallenges.set(userId, {
        challenge,
        type: 'authentication',
        createdAt: Date.now(),
      });
    }

    const options = {
      challenge,
      timeout: 60000,
      userVerification: 'required',
      rpId: req.hostname === 'localhost' ? 'localhost' : req.hostname,
    };

    if (credentials && credentials.length > 0) {
      options.allowCredentials = credentials.map(cred => ({
        id: cred.rawId,
        type: 'public-key',
        transports: ['internal'],
      }));
    }

    res.json({
      success: true,
      options,
    });
  } catch (error) {
    console.error('WebAuthn authentication options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authentication options',
    });
  }
});

router.post('/authenticate/verify', (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'credential is required',
      });
    }

    let foundUserId = null;
    let foundCredential = null;

    for (const [userId, credentials] of userCredentials.entries()) {
      const matched = credentials.find(c => c.id === credential.id);
      if (matched) {
        foundUserId = userId;
        foundCredential = matched;
        matched.lastUsed = new Date().toISOString();
        break;
      }
    }

    if (!foundUserId) {
      return res.status(401).json({
        success: false,
        message: 'Credential not recognized',
      });
    }

    res.json({
      success: true,
      userId: foundUserId,
      credentialId: credential.id,
    });
  } catch (error) {
    console.error('WebAuthn authentication verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify authentication',
    });
  }
});

router.get('/credentials/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const credentials = userCredentials.get(userId) || [];

    res.json({
      success: true,
      credentials: credentials.map(c => ({
        id: c.id,
        deviceName: c.deviceName,
        createdAt: c.createdAt,
        lastUsed: c.lastUsed,
      })),
    });
  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get credentials',
    });
  }
});

router.delete('/credentials/:userId/:credentialId', (req, res) => {
  try {
    const { userId, credentialId } = req.params;
    const credentials = userCredentials.get(userId) || [];
    const filtered = credentials.filter(c => c.id !== credentialId);
    userCredentials.set(userId, filtered);

    res.json({
      success: true,
      message: 'Credential removed',
    });
  } catch (error) {
    console.error('Delete credential error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete credential',
    });
  }
});

export default router;
