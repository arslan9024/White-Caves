const express = require('express');
const router = express.Router();
const PropertyInventory = require('../models/PropertyInventory');
const InventoryProperty = require('../models/InventoryProperty');

// Create or get property inventory entry
router.post('/:propertyId/inventory', async (req, res) => {
  try {
    const { propertyId } = req.params;

    let inventory = await PropertyInventory.findOne({ propertyId });

    if (!inventory) {
      inventory = new PropertyInventory({
        propertyId,
        status: 'available',
        visibleTo: {
          mary: true,
        },
      });
      await inventory.save();
    }

    res.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error('Error managing inventory:', error);
    res.status(500).json({ error: 'Failed to manage inventory' });
  }
});

// Update property status for tenancy cycle (visible to Mary)
router.patch('/:propertyId/status', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { status, visibleTo, notes } = req.body;

    if (
      !status ||
      ![
        'available',
        'offer_in_progress',
        'offer_approved',
        'contract_generation',
        'contract_signature',
        'signed',
        'occupied',
        'maintenance',
        'inspection',
        'ready_for_leasing',
        'archived',
      ].includes(status)
    ) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let inventory = await PropertyInventory.findOne({ propertyId });

    if (!inventory) {
      inventory = new PropertyInventory({
        propertyId,
        status,
        visibleTo: visibleTo || {
          mary: true,
        },
      });
    } else {
      inventory.status = status;
      if (visibleTo) {
        inventory.visibleTo = {
          ...inventory.visibleTo,
          ...visibleTo,
        };
      }
    }

    if (notes) {
      inventory.notes = notes;
    }

    // Auto-update availability
    if (status === 'available' || status === 'ready_for_leasing') {
      inventory.isAvailable = true;
    } else if (['occupied', 'archived', 'maintenance'].includes(status)) {
      inventory.isAvailable = false;
    }

    await inventory.save();

    res.json({
      success: true,
      message: 'Property status updated',
      data: inventory,
    });
  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Grant property access to agent
router.post('/:propertyId/grant-access', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { agentId, accessLevel, grantedBy } = req.body;

    if (!agentId || !accessLevel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let inventory = await PropertyInventory.findOne({ propertyId });

    if (!inventory) {
      inventory = new PropertyInventory({
        propertyId,
        assignedAgents: [
          {
            agentId,
            accessLevel,
            grantedAt: new Date(),
            grantedBy,
          },
        ],
      });
    } else {
      // Check if agent already has access
      const existingAgent = inventory.assignedAgents.find(
        (a) => a.agentId.toString() === agentId
      );

      if (existingAgent) {
        existingAgent.accessLevel = accessLevel;
      } else {
        inventory.assignedAgents.push({
          agentId,
          accessLevel,
          grantedAt: new Date(),
          grantedBy,
        });
      }
    }

    await inventory.save();

    res.json({
      success: true,
      message: 'Property access granted',
      data: inventory,
    });
  } catch (error) {
    console.error('Error granting access:', error);
    res.status(500).json({ error: 'Failed to grant access' });
  }
});

// Get properties visible to Mary
router.get('/mary/visible-properties', async (req, res) => {
  try {
    const properties = await PropertyInventory.find({
      'visibleTo.mary': true,
    })
      .populate('propertyId')
      .populate('currentOfferId')
      .populate('currentContractId')
      .populate('assignedAgents.agentId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: properties,
      count: properties.length,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get agent's accessible properties
router.get('/agent/:agentId/properties', async (req, res) => {
  try {
    const { agentId } = req.params;

    const properties = await PropertyInventory.find({
      'assignedAgents.agentId': agentId,
    })
      .populate('propertyId')
      .populate('currentOfferId')
      .populate('currentTenantId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: properties,
      count: properties.length,
    });
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get property inventory by property ID
router.get('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    const inventory = await PropertyInventory.findOne({ propertyId })
      .populate('propertyId')
      .populate('currentOfferId')
      .populate('currentContractId')
      .populate('currentTenantId')
      .populate('assignedAgents.agentId');

    if (!inventory) {
      return res.status(404).json({ error: 'Property inventory not found' });
    }

    res.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

module.exports = router;
