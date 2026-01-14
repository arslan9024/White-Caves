/**
 * BayutAdapter
 * 
 * Integration adapter for Bayut.com API
 * https://www.bayut.com/
 * 
 * Handles:
 * - Property listing retrieval and search
 * - Lead capture and management
 * - Agent information
 * - Webhook integration for real-time updates
 */

import { BasePortalAdapter } from './BasePortalAdapter';
import crypto from 'crypto';

export class BayutAdapter extends BasePortalAdapter {
  constructor() {
    super('bayut', 'https://api.bayut.com/v1');
  }

  /**
   * Connect to Bayut API
   * Requires: apiKey, apiSecret
   */
  async connect(credentials) {
    if (!credentials.apiKey || !credentials.apiSecret) {
      throw new Error('Bayut requires apiKey and apiSecret');
    }

    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    this.webhookSecret = credentials.webhookSecret || crypto.randomBytes(32).toString('hex');

    try {
      // Verify credentials by making a test request
      const response = await this.makeRequest('GET', '/properties?pageNumber=1&pageSize=1');
      
      if (response && response.data) {
        this.isConnected = true;
        console.log('[Bayut] Connected successfully');
        return true;
      }
    } catch (error) {
      console.error('[Bayut] Connection failed:', error.message);
      this.isConnected = false;
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
   * Filters supported:
   * - location: string (Dubai, Abu Dhabi, etc)
   * - priceMin/priceMax: number
   * - beds: number
   * - baths: number
   * - type: string (apartment, villa, townhouse, etc)
   * - purpose: string (buy, rent)
   */
  async searchProperties(filters = {}) {
    const params = new URLSearchParams();

    if (filters.location) params.append('location', filters.location);
    if (filters.priceMin) params.append('priceMin', filters.priceMin);
    if (filters.priceMax) params.append('priceMax', filters.priceMax);
    if (filters.beds) params.append('beds', filters.beds);
    if (filters.baths) params.append('baths', filters.baths);
    if (filters.type) params.append('propertyType', filters.type);
    if (filters.purpose) params.append('transactionType', filters.purpose);
    if (filters.furnished !== undefined) params.append('furnish', filters.furnished ? 'furnished' : 'unfurnished');
    if (filters.sort) params.append('sort', filters.sort);

    params.append('pageSize', filters.pageSize || 50);
    params.append('pageNumber', filters.page || 1);

    const response = await this.makeRequest('GET', `/properties/search?${params.toString()}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(prop => this.normalizeProperty(prop));
    }

    return [];
  }

  /**
   * Get all properties with pagination
   */
  async getAllProperties(page = 1, pageSize = 50) {
    const response = await this.makeRequest(
      'GET',
      `/properties?pageNumber=${page}&pageSize=${pageSize}`
    );

    if (response.data && Array.isArray(response.data)) {
      return response.data.map(prop => this.normalizeProperty(prop));
    }

    return [];
  }

  /**
   * Create a lead on Bayut
   */
  async createLead(leadData) {
    const bayutLead = {
      propertyId: leadData.propertyId,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      message: leadData.message,
      leadSource: 'integration'
    };

    const response = await this.makeRequest('POST', '/leads', bayutLead);
    
    if (response.data) {
      return this.normalizeLead(response.data);
    }

    return null;
  }

  /**
   * Get leads from Bayut
   */
  async getLeads(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.propertyId) params.append('propertyId', filters.propertyId);
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    params.append('pageSize', filters.pageSize || 50);
    params.append('pageNumber', filters.page || 1);

    const response = await this.makeRequest('GET', `/leads?${params.toString()}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(lead => this.normalizeLead(lead));
    }

    return [];
  }

  /**
   * Update a property
   */
  async updateProperty(propertyId, updates) {
    const bayutUpdates = this.mapUpdatesToBayutFormat(updates);
    
    const response = await this.makeRequest('PUT', `/properties/${propertyId}`, bayutUpdates);
    
    if (response.data) {
      return this.normalizeProperty(response.data);
    }

    return null;
  }

  /**
   * Delete a property
   */
  async deleteProperty(propertyId) {
    await this.makeRequest('DELETE', `/properties/${propertyId}`);
    return true;
  }

  /**
   * Map standard updates to Bayut format
   */
  mapUpdatesToBayutFormat(updates) {
    const mapped = {};

    if (updates.title) mapped.title = updates.title;
    if (updates.description) mapped.description = updates.description;
    if (updates.price) mapped.price = updates.price;
    if (updates.specifications) {
      if (updates.specifications.bedrooms) mapped.beds = updates.specifications.bedrooms;
      if (updates.specifications.bathrooms) mapped.baths = updates.specifications.bathrooms;
      if (updates.specifications.area) mapped.area = updates.specifications.area;
    }
    if (updates.images) mapped.images = updates.images;
    if (updates.amenities) mapped.amenities = updates.amenities;

    return mapped;
  }

  /**
   * Setup webhook for real-time updates
   */
  async setupWebhook(webhookUrl, events = ['property.created', 'property.updated', 'lead.created']) {
    this.webhookUrl = webhookUrl;
    
    const webhook = {
      url: webhookUrl,
      events: this.mapEventsToBayutFormat(events),
      active: true,
      secret: this.webhookSecret
    };

    const response = await this.makeRequest('POST', '/webhooks', webhook);
    
    if (response.data) {
      console.log('[Bayut] Webhook configured:', response.data.id);
      return response.data;
    }

    return null;
  }

  /**
   * Map event names to Bayut format
   */
  mapEventsToBayutFormat(events) {
    const mapping = {
      'property.created': 'property:created',
      'property.updated': 'property:updated',
      'property.deleted': 'property:deleted',
      'lead.created': 'lead:created',
      'lead.updated': 'lead:updated'
    };

    return events.map(event => mapping[event] || event);
  }

  /**
   * Handle webhook payload from Bayut
   */
  async handleWebhookPayload(payload) {
    console.log('[Bayut] Webhook received:', payload.event);

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
   * Normalize Bayut property to standard format
   */
  normalizeProperty(bayutProperty) {
    const normalized = super.normalizeProperty({
      id: bayutProperty.id,
      title: bayutProperty.title,
      description: bayutProperty.description,
      price: bayutProperty.price,
      currency: bayutProperty.currency || 'AED',
      bedrooms: bayutProperty.beds,
      bathrooms: bayutProperty.baths,
      area: bayutProperty.area,
      areaUnit: 'sqft',
      type: bayutProperty.propertyType,
      purpose: bayutProperty.transactionType,
      furnished: bayutProperty.furnish === 'furnished',
      parking: bayutProperty.parking,
      images: bayutProperty.photos || [],
      amenities: bayutProperty.amenities || [],
      location: bayutProperty.location?.name || '',
      city: bayutProperty.location?.city,
      latitude: bayutProperty.location?.lat,
      longitude: bayutProperty.location?.lng,
      agent: bayutProperty.agent,
      createdAt: bayutProperty.createdDate,
      updatedAt: bayutProperty.updatedDate,
      url: bayutProperty.externalUrl || `https://www.bayut.com/property/${bayutProperty.id}`,
      verified: bayutProperty.isVerified
    });

    return normalized;
  }

  /**
   * Get Bayut property categories
   */
  async getCategories() {
    const response = await this.makeRequest('GET', '/properties/categories');
    return response.data || [];
  }

  /**
   * Get locations
   */
  async getLocations(city = 'Dubai') {
    const response = await this.makeRequest('GET', `/locations?city=${city}`);
    return response.data || [];
  }

  /**
   * Get agencies
   */
  async getAgencies(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.page) params.append('pageNumber', filters.page);

    const response = await this.makeRequest('GET', `/agencies?${params.toString()}`);
    return response.data || [];
  }

  /**
   * Get agency details
   */
  async getAgency(agencyId) {
    const response = await this.makeRequest('GET', `/agencies/${agencyId}`);
    return response.data || null;
  }
}

export default BayutAdapter;
