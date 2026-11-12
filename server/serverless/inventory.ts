import type { Express } from 'express';
import InventoryProperty from '../models/InventoryProperty.js';
import { connectDB } from './database.js';
import { readStringQuery } from './query.js';
import { respondFailure } from './responses.js';
import authMiddleware from '../middleware/auth.js';
import { requireMinRole, requirePermission } from '../middleware/rbac.js';
export function mountInventory(app: Express): void {
  app.use(
    '/api/inventory',
    authMiddleware,
    requirePermission('view_properties'),
    requireMinRole('manager')
  );
  app.get('/api/inventory/query', async (req, res) => {
    const query = readStringQuery(req.query);
    try {
      await connectDB();

      // Build filters from query parameters
      const filters: Record<string, unknown> = {
        constructionStage: query.constructionStage,
        occupancyStatus: query.occupancyStatus,
        marketAvailability: query.marketAvailability,
        furnishingLevel: query.furnishingLevel,
        legalStatus: query.legalStatus,
        area: query.area,
        areas: query.areas ? query.areas.split(',') : null,
        project: query.project,
        propertyType: query.propertyType,
        propertyTypes: query.propertyTypes ? query.propertyTypes.split(',') : null,
        minRooms: query.minRooms ? parseInt(query.minRooms) : null,
        maxRooms: query.maxRooms ? parseInt(query.maxRooms) : null,
        minArea: query.minArea ? parseInt(query.minArea) : null,
        maxArea: query.maxArea ? parseInt(query.maxArea) : null,
        minPrice: query.minPrice ? parseInt(query.minPrice) : null,
        maxPrice: query.maxPrice ? parseInt(query.maxPrice) : null,
        purpose: query.purpose,
        tags: query.tags ? query.tags.split(',') : null,
        viewType: query.viewType,
        page: query.page ? parseInt(query.page) : 1,
        limit: query.limit ? parseInt(query.limit) : 20,
        sortBy: query.sortBy || 'createdAt',
      };

      // Remove null values
      Object.keys(filters).forEach(key => filters[key] === null && delete filters[key]);

      // Execute query
      const result = await InventoryProperty.queryProperties(filters);

      res.json(result);
    } catch (error) {
      respondFailure(res, error, 'inventory.query');
    }
  });
  app.get('/api/inventory/by-pnumber/:pNumber', async (req, res) => {
    try {
      await connectDB();

      const property = await InventoryProperty.findByPNumber(req.params.pNumber);

      if (!property) {
        return res.status(404).json({ success: false, error: 'Property not found' });
      }

      res.json({ success: true, data: property });
    } catch (error) {
      respondFailure(res, error, 'inventory.lookup');
    }
  });
  app.put('/api/inventory/:id/status', requirePermission('edit_property'), async (req, res) => {
    const query = readStringQuery(req.query);
    const { id } = req.params;
    if (typeof id !== 'string') throw new TypeError('Property identifier must be a string');
    const statusUpdate: unknown = req.body;
    if (!statusUpdate || typeof statusUpdate !== 'object' || Array.isArray(statusUpdate)) {
      throw new TypeError('Status update must be an object');
    }
    try {
      await connectDB();

      const result = await InventoryProperty.updateStatus(
        id,
        { ...statusUpdate, updatedBy: req.user?.id },
        query.reason || 'api_update'
      );

      res.json({
        success: true,
        data: result,
        message: 'Property status updated',
      });
    } catch (error) {
      respondFailure(res, error, 'inventory.status');
    }
  });
  app.get('/api/inventory/statistics', async (req, res) => {
    try {
      await connectDB();

      const stats = await InventoryProperty.getStatusBreakdown();
      const areaStats = await InventoryProperty.getAreaStats();

      res.json({
        success: true,
        data: {
          statusBreakdown: stats[0],
          areaStatistics: areaStats,
        },
      });
    } catch (error) {
      respondFailure(res, error, 'inventory.statistics');
    }
  });
  app.get('/api/inventory/:id', async (req, res) => {
    try {
      await connectDB();
      const property = await InventoryProperty.findById(req.params.id)
        .populate('owners', 'name phone email company')
        .populate('primaryOwner', 'name phone email company');
      if (!property) {
        return res.status(404).json({ success: false, error: 'Property not found' });
      }
      res.json({ success: true, data: property });
    } catch (error) {
      respondFailure(res, error, 'inventory.detail');
    }
  });
}
