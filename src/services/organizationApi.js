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

  async getEmployees(options = {}) {
    const params = new URLSearchParams();
    if (options.department) params.append('department', options.department);
    if (options.level) params.append('level', options.level);
    if (options.status) params.append('status', options.status);
    if (options.search) params.append('search', options.search);
    if (options.limit) params.append('limit', options.limit);
    if (options.page) params.append('page', options.page);
    
    const response = await fetch(`${API_BASE}/employees?${params}`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  async getEmployee(id) {
    const response = await fetch(`${API_BASE}/employees/${id}`);
    if (!response.ok) throw new Error('Failed to fetch employee');
    return response.json();
  },

  async createEmployee(data) {
    const response = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  },

  async updateEmployee(id, data) {
    const response = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  },

  async deleteEmployee(id) {
    const response = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete employee');
    return response.json();
  },

  async createDepartment(data) {
    const response = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create department');
    return response.json();
  },

  async updateDepartment(id, data) {
    const response = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update department');
    return response.json();
  },

  async createService(data) {
    const response = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create service');
    return response.json();
  },

  async updateService(id, data) {
    const response = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update service');
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
  },

  async seedFullDatabase() {
    const response = await fetch('/api/seed/full', { method: 'POST' });
    if (!response.ok) throw new Error('Failed to seed database');
    return response.json();
  }
};

export default organizationApi;
