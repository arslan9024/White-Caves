import express from 'express';
import UserProfile from '../models/UserProfile.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      // Create default profile if doesn't exist
      profile = new UserProfile({ userId });
      await profile.save();
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.patch('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      profile = new UserProfile({ userId, ...updates });
    } else {
      Object.assign(profile, updates);
      profile.lastProfileUpdate = new Date();
    }

    // Calculate profile completion
    profile.calculateCompletion();

    await profile.save();

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Upload document to profile
router.post('/:userId/documents/:docType', async (req, res) => {
  try {
    const { userId, docType } = req.params;
    const { document, expiryDate, number, country } = req.body;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update specific document type
    if (docType === 'emiratesId') {
      profile.documents.emiratesId = {
        ...profile.documents.emiratesId,
        document,
        number,
        expiryDate
      };
    } else if (docType === 'passport') {
      profile.documents.passport = {
        ...profile.documents.passport,
        document,
        number,
        country,
        expiryDate
      };
    } else if (docType === 'drivingLicense') {
      profile.documents.drivingLicense = {
        ...profile.documents.drivingLicense,
        document,
        number,
        expiryDate
      };
    } else if (docType === 'addressProof') {
      profile.documents.addressProof = {
        type: document.type,
        document: document.url,
        verified: false
      };
    } else if (docType === 'bankStatement') {
      profile.documents.bankStatement = {
        document,
        uploadedAt: new Date()
      };
    }

    profile.calculateCompletion();
    await profile.save();

    res.json({
      message: `${docType} document uploaded`,
      profile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Update KYC status
router.patch('/:userId/kyc', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, rejectionReason } = req.body;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.kyc.status = status;
    profile.kyc.submittedAt = status === 'submitted' ? new Date() : profile.kyc.submittedAt;
    profile.kyc.verifiedAt = status === 'verified' ? new Date() : profile.kyc.verifiedAt;

    if (rejectionReason) {
      profile.kyc.rejectionReason = rejectionReason;
    }

    await profile.save();

    res.json({
      message: 'KYC status updated',
      kyc: profile.kyc
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update KYC' });
  }
});

// Add to favorites
router.post('/:userId/favorites/:type/:itemId', async (req, res) => {
  try {
    const { userId, type, itemId } = req.params;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (type === 'property') {
      if (!profile.favorites.properties.includes(itemId)) {
        profile.favorites.properties.push(itemId);
      }
    } else if (type === 'search') {
      if (!profile.favorites.searches.includes(itemId)) {
        profile.favorites.searches.push(itemId);
      }
    } else if (type === 'agent') {
      if (!profile.favorites.agents.includes(itemId)) {
        profile.favorites.agents.push(itemId);
      }
    }

    await profile.save();

    res.json({
      message: 'Added to favorites',
      favorites: profile.favorites
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove from favorites
router.delete('/:userId/favorites/:type/:itemId', async (req, res) => {
  try {
    const { userId, type, itemId } = req.params;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (type === 'property') {
      profile.favorites.properties = profile.favorites.properties.filter(
        (id) => id.toString() !== itemId
      );
    } else if (type === 'search') {
      profile.favorites.searches = profile.favorites.searches.filter(
        (id) => id.toString() !== itemId
      );
    } else if (type === 'agent') {
      profile.favorites.agents = profile.favorites.agents.filter(
        (id) => id.toString() !== itemId
      );
    }

    await profile.save();

    res.json({
      message: 'Removed from favorites',
      favorites: profile.favorites
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Get profile preferences
router.get('/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      preferences: profile.preferences,
      notifications: profile.notifications,
      privacy: profile.privacy
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update preferences
router.patch('/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences, notifications, privacy } = req.body;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (preferences) profile.preferences = { ...profile.preferences, ...preferences };
    if (notifications) profile.notifications = { ...profile.notifications, ...notifications };
    if (privacy) profile.privacy = { ...profile.privacy, ...privacy };

    await profile.save();

    res.json({
      message: 'Preferences updated',
      preferences: profile.preferences,
      notifications: profile.notifications,
      privacy: profile.privacy
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export default router;
