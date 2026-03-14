
import express from 'express';
import TenancyAgreement from '../models/TenancyAgreement.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { google } from 'googleapis';
const router = express.Router();

const calendar = google.calendar({ 
  version: 'v3', 
  auth: process.env.GOOGLE_API_KEY 
});

router.post('/', async (req, res) => {
  try {
    const { 
      propertyId, 
      landlordId, 
      tenantId, 
      landlordEmail,
      tenantEmail,
      propertyManagerId,
      monthlyRent, 
      securityDeposit, 
      leaseStartDate, 
      leaseEndDate,
      propertyAddress,
      terms 
    } = req.body;

    const propertyManager = await User.findById(propertyManagerId);
    if (!propertyManager) {
      return res.status(404).json({ error: 'Property manager not found' });
    }

    if (!propertyManager.roles.includes('EMPLOYEE') && !propertyManager.roles.includes('AGENT')) {
      return res.status(403).json({ error: 'Only property managers can create tenancy agreements' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.propertyManagerId && property.propertyManagerId.toString() !== propertyManagerId) {
      return res.status(403).json({ error: 'This property manager is not assigned to this property' });
    }

    const landlord = await User.findById(landlordId);
    const tenant = await User.findById(tenantId);

    if (!landlord || !tenant) {
      return res.status(404).json({ error: 'Landlord or tenant not found' });
    }

    const leaseEnd = new Date(leaseEndDate);
    const renewalDate = new Date(leaseEnd);
    renewalDate.setDate(renewalDate.getDate() - 30);

    const agreement = new TenancyAgreement({
      propertyId,
      landlordId,
      tenantId,
      landlordEmail: landlordEmail || landlord.email,
      tenantEmail: tenantEmail || tenant.email,
      propertyManagerId: propertyManagerId || landlordId,
      renewalDate,
      agreementDetails: {
        monthlyRent,
        securityDeposit,
        leaseStartDate,
        leaseEndDate,
        propertyAddress,
        terms: terms || ''
      }
    });

    await agreement.save();

    if (process.env.GOOGLE_API_KEY && propertyManagerId) {
      try {
        const propertyManager = await User.findById(propertyManagerId);
        if (propertyManager && propertyManager.email) {
          const event = {
            summary: `Lease Renewal Reminder - ${propertyAddress}`,
            description: `Reminder: Tenancy agreement for ${propertyAddress} is due for renewal. Lease ends on ${leaseEnd.toLocaleDateString()}.`,
            start: { 
              dateTime: renewalDate.toISOString(),
              timeZone: 'UTC'
            },
            end: { 
              dateTime: new Date(renewalDate.getTime() + 60*60*1000).toISOString(),
              timeZone: 'UTC'
            },
            attendees: [{ email: propertyManager.email }],
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 }
              ]
            }
          };

          const calendarEvent = await calendar.events.insert({
            calendarId: 'primary',
            resource: event
          });

          agreement.googleCalendarEventId = calendarEvent.data.id;
          await agreement.save();
        }
      } catch (calError) {
        console.error('Error creating calendar event:', calError);
      }
    }

    res.status(201).json(agreement);
  } catch (error) {
    console.error('Error creating tenancy agreement:', error);
    res.status(500).json({ error: 'Failed to create tenancy agreement' });
  }
});

router.get('/', async (req, res) => {
  try {
    const agreements = await TenancyAgreement.find()
      .populate('propertyId')
      .populate('landlordId')
      .populate('tenantId')
      .populate('propertyManagerId')
      .sort({ createdAt: -1 });
    res.json(agreements);
  } catch (error) {
    console.error('Error fetching agreements:', error);
    res.status(500).json({ error: 'Failed to fetch agreements' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const agreement = await TenancyAgreement.findById(req.params.id)
      .populate('propertyId')
      .populate('landlordId')
      .populate('tenantId')
      .populate('propertyManagerId');
    
    if (!agreement) {
      return res.status(404).json({ error: 'Agreement not found' });
    }
    
    res.json(agreement);
  } catch (error) {
    console.error('Error fetching agreement:', error);
    res.status(500).json({ error: 'Failed to fetch agreement' });
  }
});

router.post('/:id/sign', async (req, res) => {
  try {
    const { userId, signatureData, userName, userEmail, userRole } = req.body;
    const agreement = await TenancyAgreement.findById(req.params.id).populate('landlordId').populate('tenantId');

    if (!agreement) {
      return res.status(404).json({ error: 'Agreement not found' });
    }

    if (userRole === 'landlord') {
      if (agreement.landlordId._id.toString() !== userId) {
        return res.status(403).json({ error: 'Not authorized to sign as landlord' });
      }
      
      if (userEmail.toLowerCase() !== agreement.landlordEmail.toLowerCase()) {
        return res.status(403).json({ error: 'Email does not match registered landlord email' });
      }
      
      if (agreement.signatures.landlord.signed) {
        return res.status(400).json({ error: 'Landlord has already signed' });
      }
      
      agreement.signatures.landlord = {
        signed: true,
        signatureData,
        signedAt: new Date(),
        name: userName,
        email: userEmail,
        status: 'SIGNED'
      };
    } else if (userRole === 'tenant') {
      if (agreement.tenantId._id.toString() !== userId) {
        return res.status(403).json({ error: 'Not authorized to sign as tenant' });
      }
      
      if (userEmail.toLowerCase() !== agreement.tenantEmail.toLowerCase()) {
        return res.status(403).json({ error: 'Email does not match registered tenant email' });
      }
      
      if (agreement.signatures.tenant.signed) {
        return res.status(400).json({ error: 'Tenant has already signed' });
      }
      
      agreement.signatures.tenant = {
        signed: true,
        signatureData,
        signedAt: new Date(),
        name: userName,
        email: userEmail,
        status: 'SIGNED'
      };
    } else {
      return res.status(400).json({ error: 'Invalid user role' });
    }

    await agreement.save();
    res.json(agreement);
  } catch (error) {
    console.error('Error signing agreement:', error);
    res.status(500).json({ error: 'Failed to sign agreement' });
  }
});

router.post('/:id/reject', async (req, res) => {
  try {
    const { userId, userRole, rejectionReason } = req.body;
    const agreement = await TenancyAgreement.findById(req.params.id);

    if (!agreement) {
      return res.status(404).json({ error: 'Agreement not found' });
    }

    if (userRole === 'landlord') {
      if (agreement.landlordId.toString() !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      agreement.signatures.landlord.status = 'REJECTED';
      agreement.signatures.landlord.rejectionReason = rejectionReason || 'No reason provided';
    } else if (userRole === 'tenant') {
      if (agreement.tenantId.toString() !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      agreement.signatures.tenant.status = 'REJECTED';
      agreement.signatures.tenant.rejectionReason = rejectionReason || 'No reason provided';
    } else {
      return res.status(400).json({ error: 'Invalid user role' });
    }

    await agreement.save();
    res.json(agreement);
  } catch (error) {
    console.error('Error rejecting agreement:', error);
    res.status(500).json({ error: 'Failed to reject agreement' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const agreements = await TenancyAgreement.find({
      $or: [
        { landlordId: req.params.userId },
        { tenantId: req.params.userId },
        { propertyManagerId: req.params.userId }
      ]
    })
      .populate('propertyId')
      .populate('landlordId')
      .populate('tenantId')
      .populate('propertyManagerId')
      .sort({ createdAt: -1 });
    
    res.json(agreements);
  } catch (error) {
    console.error('Error fetching user agreements:', error);
    res.status(500).json({ error: 'Failed to fetch user agreements' });
  }
});

export default router;
