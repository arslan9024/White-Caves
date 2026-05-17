import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock API for testing - simulating property endpoints
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Mock properties data
  const mockProperties = [
    {
      _id: '1',
      title: 'Luxury Villa',
      location: 'Dubai Marina',
      bedrooms: 4,
      price: 5000,
      type: 'villa',
      status: 'available',
    },
    {
      _id: '2',
      title: 'Modern Apartment',
      location: 'JBR',
      bedrooms: 2,
      price: 3000,
      type: 'apartment',
      status: 'available',
    },
  ];

  // GET /api/properties - List properties
  app.get('/api/properties', (req, res) => {
    const { location } = req.query;

    let filteredProperties = mockProperties;
    if (location) {
      filteredProperties = mockProperties.filter(p =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      properties: filteredProperties,
      total: filteredProperties.length,
    });
  });

  // GET /api/properties/:id - Get single property
  app.get('/api/properties/:id', (req, res) => {
    const property = mockProperties.find(p => p._id === req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  });

  // POST /api/properties - Create property
  app.post('/api/properties', (req, res) => {
    const { title, location, bedrooms, price, type } = req.body;

    // Validation
    if (!title || !location || !bedrooms || !price || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newProperty = {
      _id: String(mockProperties.length + 1),
      title,
      location,
      bedrooms,
      price,
      type,
      status: 'available',
    };

    mockProperties.push(newProperty);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property: newProperty,
    });
  });

  // PUT /api/properties/:id - Update property
  app.put('/api/properties/:id', (req, res) => {
    const propertyIndex = mockProperties.findIndex(p => p._id === req.params.id);

    if (propertyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    mockProperties[propertyIndex] = {
      ...mockProperties[propertyIndex],
      ...req.body,
    };

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property: mockProperties[propertyIndex],
    });
  });

  // DELETE /api/properties/:id - Delete property
  app.delete('/api/properties/:id', (req, res) => {
    const propertyIndex = mockProperties.findIndex(p => p._id === req.params.id);

    if (propertyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    mockProperties.splice(propertyIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  });

  return app;
};

describe('Property API Endpoints', () => {
  let app;
  let server;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeAll(() => {
    app = createTestApp();
    server = app.listen(0); // Random port
  });

  afterAll(() => {
    server.close();
  });

  describe('GET /api/properties', () => {
    it('should return list of properties', async () => {
      const response = await request(server).get('/api/properties').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('properties');
      expect(Array.isArray(response.body.properties)).toBe(true);
      expect(response.body.properties.length).toBeGreaterThan(0);
    });

    it('should filter properties by location', async () => {
      const response = await request(server)
        .get('/api/properties?location=Dubai Marina')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties.length).toBeGreaterThan(0);
      expect(response.body.properties.every(p => p.location.includes('Dubai Marina'))).toBe(true);
    });

    it('should return empty array when no properties match filter', async () => {
      const response = await request(server)
        .get('/api/properties?location=NonexistentLocation')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties).toEqual([]);
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should return a single property by ID', async () => {
      const response = await request(server).get('/api/properties/1').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.property).toHaveProperty('_id', '1');
      expect(response.body.property).toHaveProperty('title');
      expect(response.body.property).toHaveProperty('location');
    });

    it('should return 404 for non-existent property', async () => {
      const response = await request(server).get('/api/properties/999').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('POST /api/properties', () => {
    it('should create a new property', async () => {
      const newProperty = {
        title: 'Test Villa',
        location: 'JBR',
        bedrooms: 3,
        price: 4000,
        type: 'villa',
      };

      const response = await request(server).post('/api/properties').send(newProperty).expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.property).toMatchObject(newProperty);
      expect(response.body.property).toHaveProperty('_id');
    });

    it('should return 400 for invalid property data', async () => {
      const invalidProperty = {
        title: 'Test',
        // Missing required fields
      };

      const response = await request(server)
        .post('/api/properties')
        .send(invalidProperty)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });
  });

  describe('PUT /api/properties/:id', () => {
    it('should update an existing property', async () => {
      const updates = {
        price: 5500,
        status: 'rented',
      };

      const response = await request(server).put('/api/properties/1').send(updates).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.property.price).toBe(5500);
      expect(response.body.property.status).toBe('rented');
    });

    it('should return 404 when updating non-existent property', async () => {
      const response = await request(server)
        .put('/api/properties/999')
        .send({ price: 6000 })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/properties/:id', () => {
    it('should delete an existing property', async () => {
      const response = await request(server).delete('/api/properties/2').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify property is deleted
      const getResponse = await request(server).get('/api/properties/2').expect(404);

      expect(getResponse.body.success).toBe(false);
    });

    it('should return 404 when deleting non-existent property', async () => {
      const response = await request(server).delete('/api/properties/999').expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
