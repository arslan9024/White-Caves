const API_BASE = '/api';

class CRMDataService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000;
  }

  async fetchWithAuth(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`CRMDataService error for ${endpoint}:`, error);
      throw error;
    }
  }

  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getDashboardSummary() {
    const cacheKey = 'dashboard-summary';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const data = await this.fetchWithAuth('/dashboard/summary');
    this.setCache(cacheKey, data);
    return data;
  }

  async getOwnerDashboard() {
    const cacheKey = 'owner-dashboard';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const data = await this.fetchWithAuth('/dashboard/owner/summary');
    this.setCache(cacheKey, data);
    return data;
  }

  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.set(key, value);
    });

    const endpoint = `/inventory/properties${queryParams.toString() ? '?' + queryParams : ''}`;
    return this.fetchWithAuth(endpoint);
  }

  async getPropertyStats() {
    return this.fetchWithAuth('/inventory/properties/stats');
  }

  async getPropertyAreas() {
    return this.fetchWithAuth('/inventory/properties/areas');
  }

  async getPropertyById(id) {
    return this.fetchWithAuth(`/inventory/properties/${id}`);
  }

  async getOwners() {
    return this.fetchWithAuth('/inventory/owners');
  }

  async getOwnerById(id) {
    return this.fetchWithAuth(`/inventory/owners/${id}`);
  }

  async getRecentLeads() {
    return this.fetchWithAuth('/dashboard/leads/recent');
  }

  async getLeadMetrics() {
    return this.fetchWithAuth('/dashboard/metrics');
  }

  async getAnalytics() {
    return this.fetchWithAuth('/dashboard/analytics');
  }

  async getRecentActivities() {
    return this.fetchWithAuth('/dashboard/activities');
  }

  async getFeaturedProperties() {
    return this.fetchWithAuth('/featured-properties');
  }

  async getSchedulerStatus() {
    return this.fetchWithAuth('/scheduler/status');
  }

  async getZoeBriefing() {
    return this.fetchWithAuth('/zoe/briefing');
  }

  async getZoeDepartments() {
    return this.fetchWithAuth('/zoe/departments');
  }

  async getZoeServices() {
    return this.fetchWithAuth('/zoe/services');
  }

  async getOliviaFeaturedProperties() {
    return this.fetchWithAuth('/olivia');
  }

  async refreshOliviaProperties() {
    return this.fetchWithAuth('/olivia/refresh', { method: 'POST' });
  }

  clearCache() {
    this.cache.clear();
  }
}

export const crmDataService = new CRMDataService();
export default crmDataService;
