/**
 * @file LindaFeatureCatalog.ts
 * @description Synced from arslan9024/whatsapp-bot-linda (src/terminal/FeatureCatalog.js & src/terminal/TerminalPlaybooks.js).
 * Provides all 35 numbered features (F1–F35), 10 operational playbooks (P1–P10),
 * and dotted menu codes (1.1–9.11) with live usage counters.
 */

export interface LindaFeatureDef {
  id: number;
  command: string;
  name: string;
  category: 'Devices' | 'Health' | 'Messaging' | 'Intelligence' | 'Data' | 'System';
  menuCode: string;
  usage?: string;
  needsArgs?: boolean;
  restored?: boolean;
  aliases?: string[];
}

export interface LindaPlaybookStep {
  stepNumber: number;
  code: string;
  command: string;
  note: string;
}

export interface LindaPlaybookDef {
  id: number;
  code: string;
  problem: string;
  steps: LindaPlaybookStep[];
}

export const LINDA_FEATURES_35: readonly LindaFeatureDef[] = Object.freeze([
  // Devices & linking (F1–F14)
  { id: 1, command: 'status', name: 'Dashboard', category: 'Devices', menuCode: '6.1', aliases: [''] },
  { id: 2, command: 'link-code', name: 'Link master (code)', category: 'Devices', menuCode: '2.1' },
  { id: 3, command: 'link-qr', name: 'Link master (QR)', category: 'Devices', menuCode: '2.2' },
  { id: 4, command: 'link', name: 'Add master account', category: 'Devices', menuCode: '1.5', usage: 'link master [+phone] [name]' },
  { id: 5, command: 'relink', name: 'Relink device', category: 'Devices', menuCode: '1.9', usage: 'relink master|servant [+phone]' },
  { id: 6, command: 'code', name: 'New pairing code', category: 'Devices', menuCode: '1.12', usage: 'code <+phone>', needsArgs: true },
  { id: 7, command: 'recover', name: 'Reactivate device', category: 'Devices', menuCode: '1.16', usage: 'recover <+phone>', needsArgs: true },
  { id: 8, command: 'restore', name: 'Restore all sessions', category: 'Devices', menuCode: '1.7', aliases: ['restore-sessions'] },
  { id: 9, command: 'disconnect', name: 'Disconnect (keep session)', category: 'Devices', menuCode: '1.17', usage: 'disconnect <+phone>', needsArgs: true },
  { id: 10, command: 'device', name: 'Device details', category: 'Devices', menuCode: '1.13', usage: 'device <+phone>', needsArgs: true },
  { id: 11, command: 'list', name: 'List devices', category: 'Devices', menuCode: '1.2' },
  { id: 12, command: 'masters', name: 'Master accounts', category: 'Devices', menuCode: '1.3' },
  { id: 13, command: 'servants', name: 'Servant accounts', category: 'Devices', menuCode: '1.4' },
  { id: 14, command: 'accounts', name: 'All accounts', category: 'Devices', menuCode: '1.1' },
  // Health & analytics (F15–F18)
  { id: 15, command: 'health', name: 'Account health', category: 'Health', menuCode: '1.18', usage: 'health [+phone]' },
  { id: 16, command: 'stats', name: 'Account metrics', category: 'Health', menuCode: '1.15', usage: 'stats <+phone>' },
  { id: 17, command: 'score', name: 'Health score 0-100', category: 'Health', menuCode: '8.3', usage: 'score [+phone]', restored: true },
  { id: 18, command: 'analytics', name: 'Analytics', category: 'Health', menuCode: '4.1', aliases: ['metrics'], usage: 'analytics [report|uptime|account <phone>]' },
  // Messaging (F19–F23)
  { id: 19, command: 'campaigns', name: 'Message Sender', category: 'Messaging', menuCode: '6.4' },
  { id: 20, command: 'send', name: 'Send one message', category: 'Messaging', menuCode: '8.1', usage: 'send <number> <message>', needsArgs: true },
  { id: 21, command: 'validate', name: 'Validate number', category: 'Messaging', menuCode: '8.2', usage: 'validate <number>', needsArgs: true },
  { id: 22, command: 'chats', name: 'List chats', category: 'Messaging', menuCode: '8.9', usage: 'chats [+phone] [page]' },
  { id: 23, command: 'analyze', name: 'Analyze chat', category: 'Messaging', menuCode: '8.10', usage: 'analyze <+phone> <n> [max]', needsArgs: true },
  // Intelligence (restored from archive, F24–F27)
  { id: 24, command: 'sentiment', name: 'Sentiment of text', category: 'Intelligence', menuCode: '8.4', usage: 'sentiment <text>', needsArgs: true, restored: true },
  { id: 25, command: 'intent', name: 'Intent of text', category: 'Intelligence', menuCode: '8.5', usage: 'intent <text>', needsArgs: true, restored: true },
  { id: 26, command: 'similar', name: 'Compare names/phones', category: 'Intelligence', menuCode: '8.6', usage: 'similar <a> | <b>', needsArgs: true, restored: true },
  { id: 27, command: 'dedupe', name: 'Find duplicate contacts', category: 'Intelligence', menuCode: '8.7', usage: 'dedupe <file.csv|file.json>', needsArgs: true, restored: true },
  // Data (F28–F29)
  { id: 28, command: 'goraha', name: 'Goraha contacts', category: 'Data', menuCode: '3.1', usage: 'goraha [verify|contacts|filter <text>]' },
  { id: 29, command: 'sheets', name: 'Google Sheets', category: 'Data', menuCode: '5.1', aliases: ['google'], usage: 'sheets read|add|update|delete|search|info ...' },
  // System (F30–F33)
  { id: 30, command: 'menu', name: 'Numbered menu', category: 'System', menuCode: '0' },
  { id: 31, command: 'features', name: 'Feature list', category: 'System', menuCode: '6.5' },
  { id: 32, command: 'help', name: 'Help', category: 'System', menuCode: '6.2' },
  { id: 33, command: 'quit', name: 'Quit', category: 'System', menuCode: '6.3', aliases: ['exit'] },
  // New Conversation Report & Area Owner Outreach (F34–F35)
  { id: 34, command: 'convos', name: 'Conversation report', category: 'Messaging', menuCode: '8.11', usage: 'convos [+phone]', aliases: ['conversations'] },
  { id: 35, command: 'outreach', name: 'Area owner outreach planner', category: 'Messaging', menuCode: '9.1', usage: 'outreach <project…> | outreach projects | outreach budget' },
]);

export const LINDA_PLAYBOOKS_10: readonly LindaPlaybookDef[] = Object.freeze([
  {
    id: 1,
    code: 'P1',
    problem: 'Restore master (offline but still linked)',
    steps: [
      { stepNumber: 1, code: '1.16', command: 'recover +971500000001', note: 'Reactivate the saved session; no new code needed.' },
      { stepNumber: 2, code: '1.9', command: 'relink master +971500000001', note: 'Only if step 1 fails: new QR or pairing code.' },
      { stepNumber: 3, code: '2.1', command: 'link-code', note: 'Last resort: link the master with a pairing code.' },
    ],
  },
  {
    id: 2,
    code: 'P2',
    problem: 'Link a new master',
    steps: [
      { stepNumber: 1, code: '2.1', command: 'link-code', note: 'Link with a pairing code (enter it on the phone).' },
      { stepNumber: 2, code: '2.2', command: 'link-qr', note: 'Or link with a QR code.' },
      { stepNumber: 3, code: '1.3', command: 'masters', note: 'Check the master is listed and linked.' },
    ],
  },
  {
    id: 3,
    code: 'P3',
    problem: 'Pairing code delayed or failed',
    steps: [
      { stepNumber: 1, code: '1.12', command: 'code +971500000001', note: 'Request a fresh pairing code (or type r while linking).' },
      { stepNumber: 2, code: '2.2', command: 'link-qr', note: 'Still failing: switch to QR code linking.' },
      { stepNumber: 3, code: '1.9', command: 'relink master +971500000001', note: 'Restart linking from scratch.' },
    ],
  },
  {
    id: 4,
    code: 'P4',
    problem: 'Sessions missing after restart',
    steps: [
      { stepNumber: 1, code: '1.7', command: 'restore-sessions', note: 'Restore all saved sessions.' },
      { stepNumber: 2, code: '1.18', command: 'health', note: 'See which accounts are still offline.' },
      { stepNumber: 3, code: '1.16', command: 'recover +971500000001', note: 'Reactivate the master if it is still offline.' },
    ],
  },
  {
    id: 5,
    code: 'P5',
    problem: 'Device removed / logged out',
    steps: [
      { stepNumber: 1, code: '1.13', command: 'device +971500000001', note: 'Confirm the link state of the master device.' },
      { stepNumber: 2, code: '1.9', command: 'relink master +971500000001', note: 'Relink; a removed device needs a new code/QR.' },
      { stepNumber: 3, code: '1.7', command: 'restore-sessions', note: 'Restore the other saved sessions.' },
    ],
  },
  {
    id: 6,
    code: 'P6',
    problem: 'Add a servant account',
    steps: [
      { stepNumber: 1, code: '1.10', command: 'relink servant +971520000002', note: 'Link the servant by phone (QR or code).' },
      { stepNumber: 2, code: '1.4', command: 'servants', note: 'Check the servant is listed.' },
      { stepNumber: 3, code: '1.14', command: 'health +971520000002', note: 'Check the servant health.' },
    ],
  },
  {
    id: 7,
    code: 'P7',
    problem: 'Analyze conversations',
    steps: [
      { stepNumber: 1, code: '8.11', command: 'convos +971500000001', note: 'Report: total chats, last chat, messages per chat.' },
      { stepNumber: 2, code: '8.9', command: 'chats +971500000001', note: 'Numbered chat list.' },
      { stepNumber: 3, code: '8.10', command: 'analyze +971500000001 1 100', note: 'Analyze one chat by its number.' },
    ],
  },
  {
    id: 8,
    code: 'P8',
    problem: 'Send a message safely',
    steps: [
      { stepNumber: 1, code: '8.2', command: 'validate +971501234567', note: 'Validate the number first.' },
      { stepNumber: 2, code: '8.1', command: 'send +971501234567 Marhaba from White Caves', note: 'Send one message (asks to confirm).' },
    ],
  },
  {
    id: 9,
    code: 'P9',
    problem: 'Clean contacts',
    steps: [
      { stepNumber: 1, code: '3.2', command: 'goraha verify', note: 'Verify and recount contacts.' },
      { stepNumber: 2, code: '3.4', command: 'goraha filter Dubai', note: 'Search contacts.' },
      { stepNumber: 3, code: '8.7', command: 'dedupe contacts.csv', note: 'Find duplicates in a CSV/XLSX/JSON file.' },
    ],
  },
  {
    id: 10,
    code: 'P10',
    problem: 'Daily health check',
    steps: [
      { stepNumber: 1, code: '6.1', command: 'status', note: 'Health dashboard.' },
      { stepNumber: 2, code: '1.18', command: 'health', note: 'Health of all accounts.' },
      { stepNumber: 3, code: '8.3', command: 'score', note: 'Health scores.' },
      { stepNumber: 4, code: '4.3', command: 'analytics uptime', note: 'Uptime report.' },
    ],
  },
]);

class LindaFeatureCatalogService {
  private counts = new Map<number, number>([
    [1, 18], [2, 4], [3, 6], [7, 9], [8, 12], [11, 7], [15, 14], [17, 11],
    [18, 9], [19, 15], [21, 8], [22, 10], [23, 6], [24, 13], [25, 11],
    [28, 9], [29, 7], [31, 5], [34, 16], [35, 19],
  ]);

  private playbookCounts = new Map<number, number>([
    [1, 5], [2, 2], [4, 6], [7, 11], [8, 4], [9, 3], [10, 14],
  ]);

  getFeaturesWithCounts() {
    return LINDA_FEATURES_35.map(f => ({
      ...f,
      uses: this.counts.get(f.id) || 0,
    }));
  }

  getPlaybooksWithCounts() {
    return LINDA_PLAYBOOKS_10.map(p => ({
      ...p,
      runs: this.playbookCounts.get(p.id) || 0,
    }));
  }

  recordFeatureUse(idOrCommand: number | string): LindaFeatureDef | null {
    const feature =
      typeof idOrCommand === 'number'
        ? LINDA_FEATURES_35.find(f => f.id === idOrCommand)
        : LINDA_FEATURES_35.find(
            f =>
              f.command === String(idOrCommand).toLowerCase() ||
              f.menuCode === String(idOrCommand) ||
              (f.aliases && f.aliases.includes(String(idOrCommand).toLowerCase()))
          );
    if (!feature) return null;
    this.counts.set(feature.id, (this.counts.get(feature.id) || 0) + 1);
    return feature;
  }

  recordPlaybookRun(id: number): LindaPlaybookDef | null {
    const pb = LINDA_PLAYBOOKS_10.find(p => p.id === id);
    if (!pb) return null;
    this.playbookCounts.set(pb.id, (this.playbookCounts.get(pb.id) || 0) + 1);
    return pb;
  }
}

export const lindaFeatureCatalog = new LindaFeatureCatalogService();
