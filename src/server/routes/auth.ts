import express from 'express';
import { verifyIdToken, getUser } from '../config/firebaseAdmin.js';
import { generateJWT, authenticateToken } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/verify-firebase-token', asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  
  if (!idToken) {
    return res.status(400).json({ error: 'Firebase ID token is required' });
  }

  const firebaseUser = await verifyIdToken(idToken);
  
  let user = await User.findOne({ 
    $or: [
      { firebaseUid: firebaseUser.uid },
      { phone: firebaseUser.phone_number }
    ]
  });

  const isNewUser = !user;

  if (!user) {
    user = new User({
      firebaseUid: firebaseUser.uid,
      phone: firebaseUser.phone_number,
      email: firebaseUser.email || '',
      name: firebaseUser.name || '',
      profileComplete: false,
      createdAt: new Date()
    });
    await user.save();
  } else {
    user.firebaseUid = firebaseUser.uid;
    user.lastLogin = new Date();
    await user.save();
  }

  const jwtToken = generateJWT(user);

  res.json({
    success: true,
    isNewUser,
    user: {
      id: user._id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      profileComplete: user.profileComplete
    },
    token: jwtToken
  });
}));

router.put('/complete-profile', authenticateToken, asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (name) user.name = name;
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    user.email = email;
  }
  
  user.profileComplete = !!(user.name && user.phone);
  user.updatedAt = new Date();
  await user.save();

  const newToken = generateJWT(user);

  res.json({
    success: true,
    user: {
      id: user._id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      profileComplete: user.profileComplete
    },
    token: newToken
  });
}));

router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      profileComplete: user.profileComplete,
      role: user.role
    }
  });
}));

router.post('/logout', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
