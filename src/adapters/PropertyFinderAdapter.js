/**
 * PropertyFinderAdapter
 * 
 * Integration adapter for PropertyFinder.ae API
 * https://www.propertyfinder.ae/
 * 
 * Handles:
 * - Property listing retrieval and search
 * - Lead capture and management
 * - Developer information
 * - Webhook integration
 */

import { BasePortalAdapter } from './BasePortalAdapter';
import crypto from 'crypto';

export class PropertyFinderAdapter extends BasePortalAdapter {
  constructor() {
    super('propertyfinder', 'https://api.propertyfinder.ae/v1');
  }

  /**
   * Connect to PropertyFinder API
   * Requires: apiKey
   */
  async connect(credentials) {
    if (!credentials.apiKey) {
      throw new Error('PropertyFinder requires apiKey');
    }

    this.apiKey = credentials.apiKey;
    this.webhookSecret = credentials.webhookSecret || crypto.randomBytes(32).toString('hex');

    try {
      // Verify credentials
      const response = await this.makeRequest('GET', '/properties', null, {
        'X-API-Key': this.apiKey
      });
      
      if (response) {
        this.isConnected = true;
        
        return true;
      }
    } catch (error) {
      
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Override makeRequest to use X-API-Key header
   */
  async makeRequest(method, endpoint, data = null, headers = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    
    try {
      const requestOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
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
      
      throw error;
    }
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
    if (filters.beds) params.append('bedrooms', filters.beds);
    if (filters.baths) params.append('bathrooms', filters.baths);
    if (filters.type) params.append('type', filters.type);
    if (filters.purpose) params.append('purpose', filters.purpose);
    if (filters.furnished !== undefined) params.append('furnished', filters.furnished);

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
   * Create a lead
   */
  async createLead(leadData) {
    const pfLead = {
      propertyId: leadData.propertyId,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      message: leadData.message,
      type: 'inquiry'
    };

    const response = await this.makeRequest('POST', '/leads', pfLead);
    
    if (response.data) {
      return this.normalizeLead(response.data);
    }

    return null;
  }

  /**
   * Get leads
   */
  async getLeads(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.propertyId) params.append('propertyId', filters.propertyId);
    if (filters.status) params.append('status', filters.status);

    params.append('limit', filters.pageSize || 50);
    params.append('offset', ((filters.page || 1) - 1) * (filters.pageSize || 50));

    const response = await this.makeRequest('GET', `/leads?${params.toString()}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(lead => this.normalizeLead(lead));
    }

    return [];
  }

  /**
   * Update property
   */
  async updateProperty(propertyId, updates) {
    const pfUpdates = this.mapUpdatesToPFFormat(updates);
    
    const response = await this.makeRequest('PUT', `/properties/${propertyId}`, pfUpdates);
    
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
   * Map updates to PropertyFinder format
   */
  mapUpdatesToPFFormat(updates) {
    const mapped = {};

    if (updates.title) mapped.title = updates.title;
    if (updates.description) mapped.description = updates.description;
    if (updates.price) mapped.price = updates.price;
    if (updates.specifications) {
      if (updates.specifications.bedrooms) mapped.bedrooms = updates.specifications.bedrooms;
      if (updates.specifications.bathrooms) mapped.bathrooms = updates.specifications.bathrooms;
      if (updates.specifications.area) mapped.area = updates.specifications.area;
    }
    if (updates.images) mapped.images = updates.images;

    return mapped;
  }

  /**
   * Setup webhook
   */
  async setupWebhook(webhookUrl, events = ['property.created', 'property.updated', 'lead.created']) {
    this.webhookUrl = webhookUrl;
    
    const webhook = {
      url: webhookUrl,
      events: this.mapEventsToPFFormat(events),
      active: true,
      secret: this.webhookSecret
    };

    const response = await this.makeRequest('POST', '/webhooks', webhook);
    
    if (response.data) {
      
      return response.data;
    }

    return null;
  }

  /**
   * Map events to PropertyFinder format
   */
  mapEventsToPFFormat(events) {
    const mapping = {
      'property.created': 'property.created',
      'property.updated': 'property.updated',
      'property.deleted': 'property.deleted',
      'lead.created': 'lead.created',
      'lead.updated': 'lead.updated'
    };

    return events.map(event => mapping[event] || event);
  }

  /**
   * Handle webhook payload
   */
  async handleWebhookPayload(payload) {

    if (!this.validateWebhookSignature(payload, payload.signature, this.webhookSecret)) {
      throw new Error('Invalid webhook signature');
    }

    const result = {
      event: payload.event,
      data: null,
      type: null
    };

    if (payload.event.includes('property')) {
      result.type = 'property';
      result.data = this.normalizeProperty(payload.data);
    } else if (payload.event.includes('lead')) {
      result.type = 'lead';
      result.data = this.normalizeLead(payload.data);
    }

    return result;
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(payload, signature, secret) {
    if (!signature || !secret) return false;

    const payload_string = JSON.stringify(payload.data);
    const computed_signature = crypto
      .createHmac('sha256', secret)
      .update(payload_string)
      .digest('hex');

    return computed_signature === signature;
  }

  /**
   * Normalize PropertyFinder property
   */
  normalizeProperty(pfProperty) {
    const normalized = super.normalizeProperty({
      id: pfProperty.id,
      title: pfProperty.title,
      description: pfProperty.description,
      price: pfProperty.price,
      currency: pfProperty.currency || 'AED',
      bedrooms: pfProperty.bedrooms,
      bathrooms: pfProperty.bathrooms,
      area: pfProperty.area,
      areaUnit: 'sqft',
      type: pfProperty.type,
      purpose: pfProperty.purpose,
      furnished: pfProperty.furnished || false,
      images: pfProperty.images || [],
      location: pfProperty.location?.name || '',
      city: pfProperty.location?.city,
      latitude: pfProperty.location?.lat,
      longitude: pfProperty.location?.lng,
      agent: pfProperty.agent,
      createdAt: pfProperty.createdDate,
      updatedAt: pfProperty.updatedDate,
      url: pfProperty.externalUrl || `https://www.propertyfinder.ae/property/${pfProperty.id}`,
      verified: pfProperty.verified
    });

    return normalized;
  }

  /**
   * Get developers
   */
  async getDevelopers(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.page) params.append('offset', filters.page);

    const response = await this.makeRequest('GET', `/developers?${params.toString()}`);
    return response.data || [];
  }

  /**
   * Get developer details
   */
  async getDeveloper(developerId) {
    const response = await this.makeRequest('GET', `/developers/${developerId}`);
    return response.data || null;
  }

  /**
   * Get communities
   */
  async getCommunities(city = 'Dubai') {
    const response = await this.makeRequest('GET', `/communities?city=${city}`);
    return response.data || [];
  }
}

export default PropertyFinderAdapter;
