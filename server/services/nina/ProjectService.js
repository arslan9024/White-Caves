const DAMAC_HILLS_2_PROJECTS = [
  { id: 0, name: 'Blocklist', sheetId: '1D7Sspk-FK558EvcTQsIfc5dwccoaggvRtrEPUlswNOU', category: 'system' },
  { id: 1, name: 'Vardon', sheetId: '10FmrdvAHb6K2ogYFxUO2pLWfs5lr44c5PXTFyaUHNgE', category: 'cluster' },
  { id: 2, name: 'Sanctuary', sheetId: '1IWSBaeZw54l7CE-sJ3eEyP5Cximia1YOsycOjG53IVg', category: 'cluster' },
  { id: 4, name: 'Amazonia', sheetId: '1hN1zoTKVk0S3sMYg-tubMs2WHIdtDCI7AjkNvIFmotM', category: 'cluster' },
  { id: 5, name: 'Pacifica', sheetId: '1UeuC8fzjsy7Xfsc8syhcxEYUxsTzTbP1vXrDoGm8MOw', category: 'cluster' },
  { id: 6, name: 'Acuna', sheetId: '1ZGIGDwEjXg6DvMF_VG7ELoO6ieDirbrdboZukQFQnOg', category: 'cluster' },
  { id: 7, name: 'Centaury', sheetId: '14IlE5teKGmtC1EdGj3yNmSEruRSk7aU24DezRUJezD4', category: 'cluster' },
  { id: 8, name: 'Trixis', sheetId: '1k8ODkRAZzEKSNA4GdF8pYoBMsH1tNneyokpLX99sop4', category: 'cluster' },
  { id: 9, name: 'Janusia', sheetId: '1p0Fngwst3BEv1gl40J02o08jDcVETs67zFUv-wTED9s', category: 'cluster' },
  { id: 10, name: 'Sycamore', sheetId: '1fx_Yb2UvnvLGA1SUHZ9rYz20ewYC5LSnIoBNp6i03gc', category: 'cluster' },
  { id: 12, name: 'Aquilegia', sheetId: '1f_4mcSt7EyatDA0499QcWF5KWsfvLNbeRMfi797OfUw', category: 'cluster' },
  { id: 13, name: 'Zinnia', sheetId: '1Q6O4yT8tW7XXZTdcnywcOId-FWFi55sQ_bLS_YO3Cg8', category: 'cluster' },
  { id: 14, name: 'Claret', sheetId: '12wBWbtRlytw_ndv_sWBoDFbCBKL3wWJBpBUGp7EvXb4', category: 'cluster' },
  { id: 15, name: 'Juniper', sheetId: '1B4nU5ecOF_0nI2juO7zSTb_aXqnbhEvJ8uBKnFXJlKQ', category: 'cluster' },
  { id: 17, name: 'Primrose', sheetId: '1WZaP0Yf3qsS0l_S-CHDq3Cda96LOkmfjOjKT2_8SO1Q', category: 'cluster' },
  { id: 25, name: 'Basswood', sheetId: '1KPk0z_pV7gbXyvpD02JpEV-PwJ-2CEs4B86dG1-L7IY', category: 'cluster' },
  { id: 26, name: 'Victoria', sheetId: '1oq1bVLLUNOXrBPYA6s9QewklQMgZE20kiTgkLThOyZE', category: 'cluster' },
  { id: 27, name: 'Mimosa', sheetId: '1eM15xDiF9Kb4SAW4Mq4CYPa7RYWZzP8G3S2hOnd_i3E', category: 'cluster' },
  { id: 29, name: 'Avencia-2', sheetId: '1s5gwvLRsEgvxtfoLXHs2O3EqyU48k49e8wv0AY_j31E', category: 'cluster' },
  { id: 30, name: 'Albizia', sheetId: '112ioVt8wlUF79G_MEKXTTG9yiD42YAJ5SHKFlf67hHI', category: 'cluster' },
  { id: 32, name: 'Amargo', sheetId: '1S53U2WMP0SmbnGIeUhYJ9f3q6iumgXyqicHr0f80Zrw', category: 'cluster' },
  { id: 33, name: 'Oxygen2023', sheetId: '1wBX2zhUaBg082BUmGCvqCSPI6w8eDJFtxZAsH2LjiaY', category: 'campaign' },
  { id: 34, name: 'Viridis', sheetId: '1lY1q4tuzjeNGoTCfO55U7SytB-mwNSWzKw33VmXI23U', category: 'cluster' },
  { id: 35, name: 'TAG2024', sheetId: '1Bw-5cJ9sPs__Yd2tdgRGPiWPriYN3PcCWpdAU-P_Vw0', category: 'campaign' },
  { id: 36, name: 'SYC-ZIN-ODR', sheetId: '1QnTHakbfV6tAJFyptOFLT6l-YKhFIS8oTivkMr-qUgU', category: 'combined' },
  { id: 37, name: 'SidraOne2022', sheetId: '1e2rkpZzARq02EyNXIvgTfv6iHnff3Cc5lkBZ3uXgNxE', category: 'cluster' },
  { id: 38, name: 'Aster-Coursetia', sheetId: '1n6XE3MOl0ATlpoSs3WNxNkISRGpS_3Cn7lL7LtWMqTI', category: 'combined' },
  { id: 39, name: 'TS2024', sheetId: '13gKEcFwa1urRbkXFZXNrj9bm2456U1YReEXH7CnYg8s', category: 'campaign' },
  { id: 40, name: 'Navitas', sheetId: '1KpSykxgipRBnKRGH4tGDFspYhB2jwba_uLL9VMAEJe8', category: 'cluster' },
  { id: 41, name: 'CLR-JNP-PMR', sheetId: '1etXIEtDxMNTDBH4UN5ZyEDEEuDNNEVPpmRVCsB1VgSk', category: 'combined' },
  { id: 42, name: 'D2-Attack-1', sheetId: '11lohD2eksc-SuCmTr6ZQeKGGqmITCafqxr6-JTBF8ug', category: 'campaign' },
  { id: 43, name: 'D2-Attack-6bed', sheetId: '12Rto7K3xDrOmT_XLYdiBJszfQQAAwG0kFYFDYFXmF_s', category: 'campaign' },
  { id: 44, name: 'Messages-Master-Bot', sheetId: '1ExnhMqBwN4KWaGdkizRkW20uyxk9Z4H1X0OlethBI-8', category: 'system' },
  { id: 45, name: 'Lion-WorkSheet', sheetId: '1jHPMxc9EiJoI8_V_uaO23LkdkWW2-kiKKvG57qG0XpI', category: 'system' },
  { id: 46, name: 'Sanctuary-Unique', sheetId: '1XZvL6ggvxTjiO9EgUc-PR3NF_FzyNEsjV7VmlqYarYI', category: 'cluster' },
  { id: 47, name: 'D22024NOV', sheetId: '1xPoYuU32UU8zb-qz37HqMi_5nQStzDTg1E4Y4wlaHjg', category: 'campaign' },
  { id: 48, name: 'Lagoons', sheetId: '1h-6MlJIIy7GKN6QPP5mA9gtdAZ6Npw23v2IWB109E6E', category: 'cluster' },
  { id: 49, name: 'Lagoons2024', sheetId: '1wMGXOYed6tRACBCIsjTqBiRbQfaGkkTIKigxgUdiD3A', category: 'campaign' }
];

class ProjectService {
  constructor() {
    this.projects = DAMAC_HILLS_2_PROJECTS;
  }

  getAllProjects() {
    return this.projects.filter(p => p.category !== 'system');
  }

  getProjectById(id) {
    return this.projects.find(p => p.id === id);
  }

  getProjectByName(name) {
    return this.projects.find(p => p.name.toLowerCase() === name.toLowerCase());
  }

  getProjectsByCategory(category) {
    return this.projects.filter(p => p.category === category);
  }

  getClusters() {
    return this.getProjectsByCategory('cluster');
  }

  getCampaigns() {
    return this.getProjectsByCategory('campaign');
  }

  getCombinedProjects() {
    return this.getProjectsByCategory('combined');
  }

  getSystemProjects() {
    return this.getProjectsByCategory('system');
  }

  getBlocklistProject() {
    return this.projects.find(p => p.name === 'Blocklist');
  }

  getProjectStats() {
    const categories = {};
    for (const project of this.projects) {
      if (!categories[project.category]) {
        categories[project.category] = 0;
      }
      categories[project.category]++;
    }
    return {
      total: this.projects.length,
      byCategory: categories
    };
  }

  searchProjects(query) {
    const lowerQuery = query.toLowerCase();
    return this.projects.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }

  addProject(project) {
    const maxId = Math.max(...this.projects.map(p => p.id));
    const newProject = {
      id: maxId + 1,
      name: project.name,
      sheetId: project.sheetId,
      category: project.category || 'cluster'
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(id, updates) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.projects[index] = { ...this.projects[index], ...updates };
    return this.projects[index];
  }

  deleteProject(id) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.projects.splice(index, 1);
    return true;
  }
}

export default new ProjectService();
