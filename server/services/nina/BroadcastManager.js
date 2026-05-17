import PhoneNumberService from './PhoneNumberService.js';

class BroadcastManager {
  constructor() {
    this.activeCampaigns = new Map();
    this.campaignHistory = [];
    this.defaultSettings = {
      minDelay: 120000,
      maxDelay: 300000,
      shiftStart: 8,
      shiftEnd: 19,
      speed: 1,
      skipExistingChats: true,
      respectBlocklist: true
    };
  }

  createCampaign(config) {
    const campaign = {
      id: `campaign_${Date.now()}`,
      name: config.name,
      projectId: config.projectId,
      projectName: config.projectName,
      status: 'pending',
      settings: { ...this.defaultSettings, ...config.settings },
      stats: {
        total: 0,
        sent: 0,
        failed: 0,
        skipped: 0,
        blocked: 0
      },
      numbers: [],
      message: config.message,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      lastActivity: null,
      logs: []
    };

    this.activeCampaigns.set(campaign.id, campaign);
    return campaign;
  }

  async prepareCampaign(campaignId, numbers, blocklist = []) {
    const campaign = this.activeCampaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const validNumbers = numbers
      .map(n => PhoneNumberService.validateAndFormat(n))
      .filter(n => n.valid);

    const filteredNumbers = PhoneNumberService.filterByBlocklist(validNumbers, blocklist);

    const uniqueNumbers = [...new Map(
      filteredNumbers.map(n => [n.formatted, n])
    ).values()];

    campaign.numbers = uniqueNumbers;
    campaign.stats.total = uniqueNumbers.length;
    campaign.stats.blocked = validNumbers.length - filteredNumbers.length;
    campaign.status = 'ready';

    this.addLog(campaignId, 'info', `Campaign prepared: ${uniqueNumbers.length} numbers ready, ${campaign.stats.blocked} blocked`);

    return campaign;
  }

  async startCampaign(campaignId, clientPool, onProgress) {
    const campaign = this.activeCampaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'ready') {
      throw new Error('Campaign not ready to start');
    }

    campaign.status = 'running';
    campaign.startedAt = new Date();
    this.addLog(campaignId, 'info', 'Campaign started');

    for (let i = 0; i < campaign.numbers.length; i++) {
      if (campaign.status === 'paused' || campaign.status === 'cancelled') {
        break;
      }

      const number = campaign.numbers[i];
      const clientIndex = i % clientPool.length;
      const client = clientPool[clientIndex];

      try {
        if (!this.isWithinShiftHours(campaign.settings)) {
          await this.waitUntilShiftStart(campaign.settings);
        }

        if (campaign.settings.skipExistingChats) {
          const chatExists = await this.checkExistingChat(client, number.whatsappFormat);
          if (chatExists) {
            campaign.stats.skipped++;
            this.addLog(campaignId, 'skip', `Skipped existing chat: ${number.formatted}`);
            continue;
          }
        }

        await this.sendMessage(client, number.whatsappFormat, campaign.message);
        campaign.stats.sent++;
        this.addLog(campaignId, 'success', `Message sent to ${number.formatted}`);

        if (onProgress) {
          onProgress({
            campaignId,
            progress: ((i + 1) / campaign.numbers.length) * 100,
            stats: { ...campaign.stats }
          });
        }

        const delay = this.calculateDelay(campaign.settings);
        await this.sleep(delay);

      } catch (error) {
        campaign.stats.failed++;
        this.addLog(campaignId, 'error', `Failed to send to ${number.formatted}: ${error.message}`);
      }

      campaign.lastActivity = new Date();
    }

    if (campaign.status === 'running') {
      campaign.status = 'completed';
      campaign.completedAt = new Date();
      this.addLog(campaignId, 'info', `Campaign completed: ${campaign.stats.sent} sent, ${campaign.stats.failed} failed`);
    }

    this.campaignHistory.push({ ...campaign });
    return campaign;
  }

  pauseCampaign(campaignId) {
    const campaign = this.activeCampaigns.get(campaignId);
    if (campaign && campaign.status === 'running') {
      campaign.status = 'paused';
      this.addLog(campaignId, 'info', 'Campaign paused');
      return true;
    }
    return false;
  }

  resumeCampaign(campaignId) {
    const campaign = this.activeCampaigns.get(campaignId);
    if (campaign && campaign.status === 'paused') {
      campaign.status = 'running';
      this.addLog(campaignId, 'info', 'Campaign resumed');
      return true;
    }
    return false;
  }

  cancelCampaign(campaignId) {
    const campaign = this.activeCampaigns.get(campaignId);
    if (campaign) {
      campaign.status = 'cancelled';
      campaign.completedAt = new Date();
      this.addLog(campaignId, 'warning', 'Campaign cancelled');
      this.campaignHistory.push({ ...campaign });
      return true;
    }
    return false;
  }

  getCampaign(campaignId) {
    return this.activeCampaigns.get(campaignId);
  }

  getActiveCampaigns() {
    return Array.from(this.activeCampaigns.values())
      .filter(c => ['pending', 'ready', 'running', 'paused'].includes(c.status));
  }

  getCampaignHistory() {
    return this.campaignHistory;
  }

  addLog(campaignId, type, message) {
    const campaign = this.activeCampaigns.get(campaignId);
    if (campaign) {
      campaign.logs.push({
        time: new Date().toISOString(),
        type,
        message
      });
    }
  }

  isWithinShiftHours(settings) {
    const hour = new Date().getHours();
    return hour >= settings.shiftStart && hour < settings.shiftEnd;
  }

  async waitUntilShiftStart(settings) {
    const now = new Date();
    const nextStart = new Date(now);
    
    if (now.getHours() >= settings.shiftEnd) {
      nextStart.setDate(nextStart.getDate() + 1);
    }
    nextStart.setHours(settings.shiftStart, 0, 0, 0);
    
    const waitMs = nextStart.getTime() - now.getTime();
    await this.sleep(waitMs);
  }

  calculateDelay(settings) {
    const baseDelay = Math.random() * (settings.maxDelay - settings.minDelay) + settings.minDelay;
    return baseDelay / settings.speed;
  }

  async checkExistingChat(client, number) {
    try {
      const chat = await client.getChatById(number);
      return chat && chat.timestamp;
    } catch {
      return false;
    }
  }

  async sendMessage(client, number, message) {
    return client.sendMessage(number, message);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats() {
    const active = this.getActiveCampaigns();
    const completed = this.campaignHistory.filter(c => c.status === 'completed');
    
    return {
      activeCampaigns: active.length,
      completedCampaigns: completed.length,
      totalMessagesSent: completed.reduce((sum, c) => sum + c.stats.sent, 0),
      totalMessagesFailed: completed.reduce((sum, c) => sum + c.stats.failed, 0),
      averageSuccessRate: completed.length > 0
        ? completed.reduce((sum, c) => sum + (c.stats.sent / c.stats.total), 0) / completed.length * 100
        : 0
    };
  }
}

export default new BroadcastManager();
