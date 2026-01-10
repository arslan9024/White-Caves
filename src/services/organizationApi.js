const API_BASE = '/api/organization';

export const organizationApi = {
  async getDepartments(options = {}) {
    const params = new URLSearchParams();
    if (options.populate) params.append('populate', 'true');
    if (options.status) params.append('status', options.status);
    
    const response = await fetch(`${API_BASE}/departments?${params}`);
    if (!response.ok) throw new Error('Failed to fetch departments');
    return response.json();
  },

  async getDepartment(id) {
    const response = await fetch(`${API_BASE}/departments/${id}`);
    if (!response.ok) throw new Error('Failed to fetch department');
    return response.json();
  },

  async getAssistants(options = {}) {
    const params = new URLSearchParams();
    if (options.department) params.append('department', options.department);
    if (options.status) params.append('status', options.status);
    
    const response = await fetch(`${API_BASE}/assistants?${params}`);
    if (!response.ok) throw new Error('Failed to fetch assistants');
    return response.json();
  },

  async getAssistant(id) {
    const response = await fetch(`${API_BASE}/assistants/${id}`);
    if (!response.ok) throw new Error('Failed to fetch assistant');
    return response.json();
  },

  async getAssistantByCode(code) {
    const response = await fetch(`${API_BASE}/assistants/code/${code}`);
    if (!response.ok) throw new Error('Failed to fetch assistant');
    return response.json();
  },

  async updateAssistantStatus(id, status) {
    const response = await fetch(`${API_BASE}/assistants/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update assistant status');
    return response.json();
  },

  async getTeams(options = {}) {
    const params = new URLSearchParams();
    if (options.department) params.append('department', options.department);
    if (options.status) params.append('status', options.status);
    
    const response = await fetch(`${API_BASE}/teams?${params}`);
    if (!response.ok) throw new Error('Failed to fetch teams');
    return response.json();
  },

  async getTeam(id) {
    const response = await fetch(`${API_BASE}/teams/${id}`);
    if (!response.ok) throw new Error('Failed to fetch team');
    return response.json();
  },

  async getServices(options = {}) {
    const params = new URLSearchParams();
    if (options.category) params.append('category', options.category);
    if (options.department) params.append('department', options.department);
    if (options.status) params.append('status', options.status);
    
    const response = await fetch(`${API_BASE}/services?${params}`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  },

  async getService(id) {
    const response = await fetch(`${API_BASE}/services/${id}`);
    if (!response.ok) throw new Error('Failed to fetch service');
    return response.json();
  },

  async getServicesByCategory(category) {
    const response = await fetch(`${API_BASE}/services/category/${category}`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  },

  async search(query, type = 'all') {
    const params = new URLSearchParams({ q: query, type });
    const response = await fetch(`${API_BASE}/search?${params}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  async getStats() {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  async getSeedStatus() {
    const response = await fetch('/api/seed/status');
    if (!response.ok) throw new Error('Failed to fetch seed status');
    return response.json();
  },

  async seedDatabase() {
    const response = await fetch('/api/seed/organization', { method: 'POST' });
    if (!response.ok) throw new Error('Failed to seed database');
    return response.json();
  }
};

export default organizationApi;
