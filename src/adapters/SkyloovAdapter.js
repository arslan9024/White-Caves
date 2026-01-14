/**
 * SkyloovAdapter
 * 
 * Integration adapter for Skyloov API
 * https://www.skyloov.com/
 * 
 * Handles:
 * - Property portfolio management
 * - Tenant management
 * - Maintenance requests
 * - Payment processing
 * - Webhook integration
 */

import { BasePortalAdapter } from './BasePortalAdapter';
import crypto from 'crypto';

export class SkyloovAdapter extends BasePortalAdapter {
  constructor() {
    super('skyloov', 'https://api.skyloov.com/v1');
  }

  /**
   * Connect to Skyloov API
   * Requires: apiKey, apiSecret
   */
  async connect(credentials) {
    if (!credentials.apiKey || !credentials.apiSecret) {
      throw new Error('Skyloov requires apiKey and apiSecret');
    }

    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    this.webhookSecret = credentials.webhookSecret || crypto.randomBytes(32).toString('hex');

    try {
      // Verify credentials
      const response = await this.makeRequest('GET', '/properties?limit=1');
      
      if (response) {
        this.isConnected = true;
        console.log('[Skyloov] Connected successfully');
        return true;
      }
    } catch (error) {
      console.error('[Skyloov] Connection failed:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Override makeRequest to use proper Skyloov auth
   */
  async makeRequest(method, endpoint, data = null, headers = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.generateSignature(method, endpoint, timestamp, data);
    
    try {
      const requestOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Signature': signature,
          'X-Timestamp': timestamp.toString(),
          ...headers
        }
      };

      if (data) {
        requestOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, requestOptions);
      
      // Handle rate limiting
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');
      
      if (remaining) this.rateLimitRemaining = parseInt(remaining);
      if (reset) this.rateLimitReset = parseInt(reset);

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 60;
        throw new Error(`Rate limited. Retry after ${retryAfter}s`);
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[Skyloov] Request failed:`, error);
      throw error;
    }
  }

  /**
   * Generate API signature
   */
  generateSignature(method, endpoint, timestamp, data = null) {
    const message = `${method}${endpoint}${timestamp}${data ? JSON.stringify(data) : ''}`;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('hex');
  }

  /**
   * Get property by ID
   */
  async getProperty(propertyId) {
    const response = await this.makeRequest('GET', `/properties/${propertyId}`);
    
    if (response.data) {
      return this.normalizeProperty(response.data);
    }
    
    return null;
  }

  /**
   * Search properties
   */
  async searchProperties(filters = {}) {
    const params = new URLSearchParams();

    if (filters.location) params.append('location', filters.location);
    if (filters.priceMin) params.append('priceMin', filters.priceMin);
    if (filters.priceMax) params.append('priceMax', filters.priceMax);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);

    params.append('limit', filters.pageSize || 50);
    params.append('offset', ((filters.page || 1) - 1) * (filters.pageSize || 50));

    const response = await this.makeRequest('GET', `/properties/search?${params.toString()}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(prop => this.normalizeProperty(prop));
    }

    return [];
  }

  /**
   * Get all properties
   */
  async getAllProperties(page = 1, pageSize = 50) {
    const offset = (page - 1) * pageSize;
    const response = await this.makeRequest(
      'GET',
      `/properties?limit=${pageSize}&offset=${offset}`
    );

    if (response.data && Array.isArray(response.data)) {
      return response.data.map(prop => this.normalizeProperty(prop));
    }

    return [];
  }

  /**
   * Create a lead/inquiry
   */
  async createLead(leadData) {
    const skyloovLead = {
      propertyId: leadData.propertyId,
      inquirerName: leadData.name,
      inquirerEmail: leadData.email,
      inquirerPhone: leadData.phone,
      inquiryMessage: leadData.message,
      inquiryType: 'general_inquiry'
    };

    const response = await this.makeRequest('POST', '/inquiries', skyloovLead);
    
    if (response.data) {
      return this.normalizeLead(response.data);
    }

    return null;
  }

  /**
   * Get inquiries/leads
   */
  async getLeads(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.propertyId) params.append('propertyId', filters.propertyId);
    if (filters.status) params.append('status', filters.status);

    params.append('limit', filters.pageSize || 50);
    params.append('offset', ((filters.page || 1) - 1) * (filters.pageSize || 50));

    const response = await this.makeRequest('GET', `/inquiries?${params.toString()}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(lead => this.normalizeLead(lead));
    }

    return [];
  }

  /**
   * Update property
   */
  async updateProperty(propertyId, updates) {
    const skyloovUpdates = this.mapUpdatesTOSkyloovFormat(updates);
    
    const response = await this.makeRequest('PUT', `/properties/${propertyId}`, skyloovUpdates);
    
    if (response.data) {
      return this.normalizeProperty(response.data);
    }

    return null;
  }

  /**
   * Delete property
   */
  async deleteProperty(propertyId) {
    await this.makeRequest('DELETE', `/properties/${propertyId}`);
    return true;
  }

  /**
   * Map updates to Skyloov format
   */
  mapUpdatesTOSkyloovFormat(updates) {
    const mapped = {};

    if (updates.title) mapped.title = updates.title;
    if (updates.description) mapped.description = updates.description;
    if (updates.price) mapped.rentalPrice = updates.price;
    if (updates.images) mapped.images = updates.images;

    return mapped;
  }

  /**
   * Get tenants for a property
   */
  async getTenants(propertyId, filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);

    params.append('limit', filters.pageSize || 50);

    const response = await this.makeRequest('GET', `/properties/${propertyId}/tenants?${params.toString()}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  }

  /**
   * Get tenant by ID
   */
  async getTenant(propertyId, tenantId) {
    const response = await this.makeRequest('GET', `/properties/${propertyId}/tenants/${tenantId}`);
    return response.data || null;
  }

  /**
   * Create maintenance request
   */
  async createMaintenanceRequest(propertyId, requestData) {
    const request = {
      propertyId,
      title: requestData.title,
      description: requestData.description,
      category: requestData.category,
      priority: requestData.priority || 'normal',
      assignedTo: requestData.assignedTo
    };

    const response = await this.makeRequest('POST', `/properties/${propertyId}/maintenance-requests`, request);
    return response.data || null;
  }

  /**
   * Get maintenance requests
   */
  async getMaintenanceRequests(propertyId, filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);

    const response = await this.makeRequest('GET', `/properties/${propertyId}/maintenance-requests?${params.toString()}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  }

  /**
   * Get payments
   */
  async getPayments(propertyId, filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    const response = await this.makeRequest('GET', `/properties/${propertyId}/payments?${params.toString()}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  }

  /**
   * Setup webhook
   */
  async setupWebhook(webhookUrl, events = ['property.updated', 'inquiry.created', 'payment.received']) {
    this.webhookUrl = webhookUrl;
    
    const webhook = {
      url: webhookUrl,
      events: this.mapEventsToSkyloovFormat(events),
      active: true,
      secret: this.webhookSecret
    };

    const response = await this.makeRequest('POST', '/webhooks', webhook);
    
    if (response.data) {
      console.log('[Skyloov] Webhook configured:', response.data.id);
      return response.data;
    }

    return null;
  }

  /**
   * Map events to Skyloov format
   */
  mapEventsToSkyloovFormat(events) {
    const mapping = {
      'property.created': 'property.created',
      'property.updated': 'property.updated',
      'property.deleted': 'property.deleted',
      'lead.created': 'inquiry.created',
      'lead.updated': 'inquiry.updated',
      'payment.received': 'payment.received',
      'tenant.created': 'tenant.added',
      'maintenance.created': 'maintenance.requested'
    };

    return events.map(event => mapping[event] || event);
  }

  /**
   * Handle webhook payload
   */
  async handleWebhookPayload(payload) {
    console.log('[Skyloov] Webhook received:', payload.event);

    if (!this.validateWebhookSignature(payload, payload.signature, this.webhookSecret)) {
      throw new Error('Invalid webhook signature');
    }

    const result = {
      event: payload.event,
      data: payload.data,
      type: null
    };

    if (payload.event.includes('property')) {
      result.type = 'property';
      result.data = this.normalizeProperty(payload.data);
    } else if (payload.event.includes('inquiry')) {
      result.type = 'lead';
      result.data = this.normalizeLead(payload.data);
    } else if (payload.event.includes('payment')) {
      result.type = 'payment';
    } else if (payload.event.includes('maintenance')) {
      result.type = 'maintenance';
    }

    return result;
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(payload, signature, secret) {
    if (!signature || !secret) return false;

    const timestamp = payload.timestamp;
    const message = `${payload.event}${JSON.stringify(payload.data)}${timestamp}`;
    const computed_signature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');

    return computed_signature === signature;
  }

  /**
   * Normalize Skyloov property
   */
  normalizeProperty(skyloovProperty) {
    const normalized = super.normalizeProperty({
      id: skyloovProperty.id,
      title: skyloovProperty.title,
      description: skyloovProperty.description,
      price: skyloovProperty.rentalPrice,
      currency: skyloovProperty.currency || 'AED',
      type: skyloovProperty.type,
      images: skyloovProperty.images || [],
      location: skyloovProperty.address,
      city: skyloovProperty.city,
      latitude: skyloovProperty.latitude,
      longitude: skyloovProperty.longitude,
      tenants: skyloovProperty.tenants || [],
      maintenanceRequests: skyloovProperty.maintenanceRequests || [],
      createdAt: skyloovProperty.createdDate,
      updatedAt: skyloovProperty.updatedDate,
      url: `https://www.skyloov.com/property/${skyloovProperty.id}`,
      status: skyloovProperty.status
    });

    return normalized;
  }

  /**
   * Get portfolio summary
   */
  async getPortfolioSummary() {
    const response = await this.makeRequest('GET', '/portfolio/summary');
    return response.data || null;
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    const response = await this.makeRequest('GET', `/analytics/revenue?${params.toString()}`);
    return response.data || null;
  }
}

export default SkyloovAdapter;
