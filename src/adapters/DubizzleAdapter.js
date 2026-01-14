/**
 * DubizzleAdapter
 * 
 * Integration adapter for Dubizzle.com API
 * https://www.dubizzle.com/
 * 
 * Handles:
 * - Property and automotive listing retrieval
 * - Lead management
 * - Classified ad posting
 * - Webhook integration
 */

import { BasePortalAdapter } from './BasePortalAdapter';
import crypto from 'crypto';

export class DubizzleAdapter extends BasePortalAdapter {
  constructor() {
    super('dubizzle', 'https://api.dubizzle.com/v1');
  }

  /**
   * Connect to Dubizzle API
   * Requires: apiKey, clientId, clientSecret
   */
  async connect(credentials) {
    if (!credentials.apiKey || !credentials.clientId || !credentials.clientSecret) {
      throw new Error('Dubizzle requires apiKey, clientId, and clientSecret');
    }

    this.apiKey = credentials.apiKey;
    this.clientId = credentials.clientId;
    this.clientSecret = credentials.clientSecret;
    this.webhookSecret = credentials.webhookSecret || crypto.randomBytes(32).toString('hex');

    try {
      // Verify credentials
      const response = await this.makeRequest('GET', '/listings?category=real-estate&limit=1');
      
      if (response) {
        this.isConnected = true;
        console.log('[Dubizzle] Connected successfully');
        return true;
      }
    } catch (error) {
      console.error('[Dubizzle] Connection failed:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Get property by ID
   */
  async getProperty(propertyId) {
    const response = await this.makeRequest('GET', `/listings/${propertyId}`);
    
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

    params.append('category', 'real-estate');
    
    if (filters.location) params.append('location', filters.location);
    if (filters.priceMin) params.append('priceMin', filters.priceMin);
    if (filters.priceMax) params.append('priceMax', filters.priceMax);
    if (filters.type) params.append('subcategory', filters.type);
    if (filters.purpose) params.append('offerType', filters.purpose === 'rent' ? 'rent' : 'sale');
    if (filters.furnished !== undefined) params.append('furnish', filters.furnished ? 'furnished' : 'unfurnished');
    if (filters.rooms) params.append('rooms', filters.rooms);

    params.append('limit', filters.pageSize || 50);
    params.append('offset', ((filters.page || 1) - 1) * (filters.pageSize || 50));

    const response = await this.makeRequest('GET', `/listings/search?${params.toString()}`);
    
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
      `/listings?category=real-estate&limit=${pageSize}&offset=${offset}`
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
    const dubizzleLead = {
      listingId: leadData.propertyId,
      contactName: leadData.name,
      contactEmail: leadData.email,
      contactPhone: leadData.phone,
      message: leadData.message,
      type: 'inquiry'
    };

    const response = await this.makeRequest('POST', '/inquiries', dubizzleLead);
    
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
    
    if (filters.listingId) params.append('listingId', filters.listingId);
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
   * Create a listing
   */
  async createListing(listingData) {
    const dubizzleListing = {
      category: 'real-estate',
      subcategory: listingData.type,
      title: listingData.title,
      description: listingData.description,
      price: listingData.price,
      offerType: listingData.purpose === 'rent' ? 'rent' : 'sale',
      rooms: listingData.specifications?.bedrooms,
      location: listingData.location?.address,
      images: listingData.images || [],
      contact: {
        name: listingData.name,
        email: listingData.email,
        phone: listingData.phone
      }
    };

    const response = await this.makeRequest('POST', '/listings', dubizzleListing);
    
    if (response.data) {
      return this.normalizeProperty(response.data);
    }

    return null;
  }

  /**
   * Update property/listing
   */
  async updateProperty(propertyId, updates) {
    const dubizzleUpdates = this.mapUpdatesToDubizzleFormat(updates);
    
    const response = await this.makeRequest('PUT', `/listings/${propertyId}`, dubizzleUpdates);
    
    if (response.data) {
      return this.normalizeProperty(response.data);
    }

    return null;
  }

  /**
   * Delete listing
   */
  async deleteProperty(propertyId) {
    await this.makeRequest('DELETE', `/listings/${propertyId}`);
    return true;
  }

  /**
   * Map updates to Dubizzle format
   */
  mapUpdatesToDubizzleFormat(updates) {
    const mapped = {};

    if (updates.title) mapped.title = updates.title;
    if (updates.description) mapped.description = updates.description;
    if (updates.price) mapped.price = updates.price;
    if (updates.specifications) {
      if (updates.specifications.bedrooms) mapped.rooms = updates.specifications.bedrooms;
    }
    if (updates.images) mapped.images = updates.images;

    return mapped;
  }

  /**
   * Setup webhook
   */
  async setupWebhook(webhookUrl, events = ['listing.created', 'listing.updated', 'inquiry.created']) {
    this.webhookUrl = webhookUrl;
    
    const webhook = {
      url: webhookUrl,
      events: this.mapEventsToDubizzleFormat(events),
      active: true,
      secret: this.webhookSecret
    };

    const response = await this.makeRequest('POST', '/webhooks', webhook);
    
    if (response.data) {
      console.log('[Dubizzle] Webhook configured:', response.data.id);
      return response.data;
    }

    return null;
  }

  /**
   * Map events to Dubizzle format
   */
  mapEventsToDubizzleFormat(events) {
    const mapping = {
      'property.created': 'listing.created',
      'property.updated': 'listing.updated',
      'property.deleted': 'listing.deleted',
      'lead.created': 'inquiry.created',
      'lead.updated': 'inquiry.updated'
    };

    return events.map(event => mapping[event] || event);
  }

  /**
   * Handle webhook payload
   */
  async handleWebhookPayload(payload) {
    console.log('[Dubizzle] Webhook received:', payload.event);

    if (!this.validateWebhookSignature(payload, payload.signature, this.webhookSecret)) {
      throw new Error('Invalid webhook signature');
    }

    const result = {
      event: payload.event,
      data: null,
      type: null
    };

    if (payload.event.includes('listing')) {
      result.type = 'property';
      result.data = this.normalizeProperty(payload.data);
    } else if (payload.event.includes('inquiry')) {
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
   * Normalize Dubizzle listing
   */
  normalizeProperty(dubizzleProperty) {
    const normalized = super.normalizeProperty({
      id: dubizzleProperty.id,
      title: dubizzleProperty.title,
      description: dubizzleProperty.description,
      price: dubizzleProperty.price,
      currency: dubizzleProperty.currency || 'AED',
      type: dubizzleProperty.subcategory,
      purpose: dubizzleProperty.offerType === 'rent' ? 'rent' : 'buy',
      bedrooms: dubizzleProperty.rooms,
      images: dubizzleProperty.images || [],
      location: dubizzleProperty.location?.name || '',
      city: dubizzleProperty.location?.city,
      latitude: dubizzleProperty.location?.lat,
      longitude: dubizzleProperty.location?.lng,
      agent: dubizzleProperty.contact,
      createdAt: dubizzleProperty.createdDate,
      updatedAt: dubizzleProperty.updatedDate,
      url: dubizzleProperty.externalUrl || `https://www.dubizzle.com/listing/${dubizzleProperty.id}`,
      postedBy: dubizzleProperty.postedBy
    });

    return normalized;
  }

  /**
   * Get categories
   */
  async getCategories() {
    const response = await this.makeRequest('GET', '/categories');
    return response.data || [];
  }

  /**
   * Get listings count
   */
  async getListingsCount(filters = {}) {
    const params = new URLSearchParams();
    params.append('category', 'real-estate');

    if (filters.location) params.append('location', filters.location);

    const response = await this.makeRequest('GET', `/listings/count?${params.toString()}`);
    return response.count || 0;
  }

  /**
   * Get trending listings
   */
  async getTrendingListings(limit = 10) {
    const response = await this.makeRequest('GET', `/listings/trending?category=real-estate&limit=${limit}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(prop => this.normalizeProperty(prop));
    }

    return [];
  }
}

export default DubizzleAdapter;
