import ProjectService from './ProjectService.js';
import GoogleSheetsService from './GoogleSheetsService.js';
import PhoneNumberService from './PhoneNumberService.js';
import BroadcastManager from './BroadcastManager.js';

class CampaignService {
  constructor() {
    this.initialized = false;
    this.blocklist = [];
  }

  async initialize() {
    const success = await GoogleSheetsService.initialize();
    if (success) {
      await this.loadBlocklist();
      this.initialized = true;
    } else {
      console.log('CampaignService: Running in mock mode (no Google credentials)');
      this.initialized = true;
    }
    return this.initialized;
  }

  async loadBlocklist() {
    const blocklistProject = ProjectService.getBlocklistProject();
    if (!blocklistProject) {
      console.log('CampaignService: Blocklist project not found');
      return;
    }

    const result = await GoogleSheetsService.getSheetData(blocklistProject.sheetId);
    if (result.success) {
      this.blocklist = result.data
        .flat()
        .map(n => PhoneNumberService.cleanNumber(n))
        .filter(n => n.length > 0);
      console.log(`CampaignService: Loaded ${this.blocklist.length} blocked numbers`);
    }
  }

  async refreshBlocklist() {
    await this.loadBlocklist();
    return this.blocklist.length;
  }

  getBlocklist() {
    return this.blocklist;
  }

  async addToBlocklist(numbers) {
    const cleaned = numbers.map(n => PhoneNumberService.cleanNumber(n)).filter(n => n.length > 0);
    const newNumbers = cleaned.filter(n => !this.blocklist.includes(n));
    this.blocklist.push(...newNumbers);
    return newNumbers.length;
  }

  async removeFromBlocklist(numbers) {
    const cleaned = numbers.map(n => PhoneNumberService.cleanNumber(n));
    const before = this.blocklist.length;
    this.blocklist = this.blocklist.filter(n => !cleaned.includes(n));
    return before - this.blocklist.length;
  }

  async getProjectNumbers(projectId) {
    const project = ProjectService.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const result = await GoogleSheetsService.getSheetData(project.sheetId);
    if (!result.success) {
      throw new Error(`Failed to fetch sheet data: ${result.error}`);
    }

    const processedNumbers = PhoneNumberService.processSheetRows(result.data, {
      phone: 5,
      mobile: 7,
      secondary: 8
    });

    return {
      project: project.name,
      totalRows: result.rowCount,
      ...processedNumbers
    };
  }

  async createCampaign(config) {
    const project = ProjectService.getProjectById(config.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const campaign = BroadcastManager.createCampaign({
      name: config.name || `Campaign for ${project.name}`,
      projectId: project.id,
      projectName: project.name,
      message: config.message,
      settings: config.settings || {}
    });

    const numbers = await this.getProjectNumbers(project.id);
    const validNumbers = numbers.valid.map(n => n.formatted);
    
    await BroadcastManager.prepareCampaign(
      campaign.id, 
      validNumbers, 
      this.blocklist
    );

    return campaign;
  }

  async quickCampaign(projectName, message, options = {}) {
    const project = ProjectService.getProjectByName(projectName);
    if (!project) {
      throw new Error(`Project "${projectName}" not found`);
    }

    return this.createCampaign({
      projectId: project.id,
      name: options.name,
      message,
      settings: options.settings
    });
  }

  async startCampaign(campaignId, clientPool, onProgress) {
    return BroadcastManager.startCampaign(campaignId, clientPool, onProgress);
  }

  pauseCampaign(campaignId) {
    return BroadcastManager.pauseCampaign(campaignId);
  }

  resumeCampaign(campaignId) {
    return BroadcastManager.resumeCampaign(campaignId);
  }

  cancelCampaign(campaignId) {
    return BroadcastManager.cancelCampaign(campaignId);
  }

  getCampaign(campaignId) {
    return BroadcastManager.getCampaign(campaignId);
  }

  getActiveCampaigns() {
    return BroadcastManager.getActiveCampaigns();
  }

  getCampaignHistory() {
    return BroadcastManager.getCampaignHistory();
  }

  getStats() {
    const broadcastStats = BroadcastManager.getStats();
    const projectStats = ProjectService.getProjectStats();
    
    return {
      ...broadcastStats,
      projects: projectStats,
      blocklistSize: this.blocklist.length,
      initialized: this.initialized
    };
  }

  async getProjectSummary(projectId) {
    const project = ProjectService.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const numbers = await this.getProjectNumbers(projectId);
    
    return {
      project: {
        id: project.id,
        name: project.name,
        category: project.category
      },
      numbers: {
        total: numbers.valid.length + numbers.invalid.length,
        valid: numbers.valid.length,
        invalid: numbers.invalid.length,
        uae: numbers.uaeNumbers.length,
        international: numbers.internationalNumbers.length,
        duplicates: numbers.duplicates.length
      },
      afterBlocklist: PhoneNumberService.filterByBlocklist(numbers.valid, this.blocklist).length,
      blocked: numbers.valid.length - PhoneNumberService.filterByBlocklist(numbers.valid, this.blocklist).length
    };
  }
}

export default new CampaignService();
