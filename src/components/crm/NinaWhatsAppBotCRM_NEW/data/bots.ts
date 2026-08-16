// White Caves Real Estate LLC — Nina AI Assistant Master Dataset (Female Expert Team)

export interface Bot {
  id: string;
  name: string;
  number: string;
  status: 'connected' | 'pairing' | 'pending' | 'disconnected';
  qrCode: string | null;
  pairingCode: string;
  messagesProcessed: number;
  responseRate: number;
  avgResponseTime: string;
  lastActive: string;
  uptime: string;
  features: string[];
}

export interface CodeFile {
  name: string;
  type: string;
  lines: number;
}

export interface CodeModule {
  name: string;
  expanded: boolean;
  files: CodeFile[];
}

export const REAL_NINA_BOTS: Bot[] = [
  {
    id: 'bot-primary',
    name: 'Nina AI Primary Sovereign Core (+971 50 576 0056)',
    number: '+971 50 576 0056',
    status: 'connected',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://wa.me/971505760056?text=WhiteCaves-Nina-AI-Core-Verified',
    pairingCode: 'WC-5760-056A',
    messagesProcessed: 18450,
    responseRate: 99.8,
    avgResponseTime: '0.8s',
    lastActive: 'Just now',
    uptime: '99.9%',
    features: [
      'Managing Director (Arslan Malik) Sovereign Desk',
      'DAMAC Hills 2 (9,210 Villas) Live Matcher',
      'DLD Title Deed Verification Bot',
      'whatsapp-web.js LocalAuth Session Guard',
      'Automatic Ejari & Contract Generator',
    ],
  },
  {
    id: 'bot-victoria',
    name: 'Victoria AI — Leasing & Ejari Specialist',
    number: '+971 50 889 4210',
    status: 'connected',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://wa.me/971508894210?text=WhiteCaves-Victoria-Leasing-Engine',
    pairingCode: 'WC-8894-210B',
    messagesProcessed: 11240,
    responseRate: 99.2,
    avgResponseTime: '1.1s',
    lastActive: '2 min ago',
    uptime: '99.4%',
    features: [
      'Dubai & Sharjah Tenancy Contract Generator',
      'PDC Post-Dated Cheque Tracking',
      'Form 12 Legal Notice Drafting',
      'Tenant & Landlord KYC Onboarding',
    ],
  },
  {
    id: 'bot-sofia',
    name: 'Sofia AI — DLD Compliance & Legal Specialist',
    number: '+971 50 334 1988',
    status: 'connected',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://wa.me/971503341988?text=WhiteCaves-Sofia-Compliance-Engine',
    pairingCode: 'WC-3341-988C',
    messagesProcessed: 6890,
    responseRate: 98.6,
    avgResponseTime: '1.4s',
    lastActive: '4 min ago',
    uptime: '98.9%',
    features: [
      'RERA 2024 Compliance Audit Engine',
      'UAE PDPL Data Protection Verification',
      'DLD Form A, B, and F Legal Validator',
      'Anti-Money Laundering (AML) Screening',
    ],
  },
  {
    id: 'bot-cassie',
    name: 'Cassie AI — Lead Analytics & Conversion Specialist',
    number: '+971 50 712 9904',
    status: 'connected',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://wa.me/971507129904?text=WhiteCaves-Cassie-Analytics-Engine',
    pairingCode: 'WC-7129-904D',
    messagesProcessed: 14310,
    responseRate: 99.5,
    avgResponseTime: '0.9s',
    lastActive: '1 min ago',
    uptime: '99.7%',
    features: [
      'Real-Time Buyer Intent Lead Scoring (0-100)',
      'WhatsApp Drip Campaign Telemetry',
      'Automated High-Value Lead Escalation',
      'ROI & Conversion Analytics Dashboard',
    ],
  },
];

export const CODE_MODULES: CodeModule[] = [
  {
    name: 'WhatsAppBotCore',
    expanded: true,
    files: [
      { name: 'CreatingNewWhatsAppClientForArslan.js', type: 'js', lines: 145 },
      { name: 'WhatsAppClientFunctions.js', type: 'js', lines: 320 },
      { name: 'NinaMessageHandlerEngine.js', type: 'js', lines: 280 },
      { name: 'SessionManagerPairing.js', type: 'js', lines: 190 },
    ],
  },
  {
    name: 'InventoryLeadMatcher',
    expanded: false,
    files: [
      { name: 'DamacHills2InventoryMatcher.js', type: 'js', lines: 210 },
      { name: 'LandlordPhoneLookup.js', type: 'js', lines: 165 },
      { name: 'TitleDeedVerificationBot.js', type: 'js', lines: 195 },
    ],
  },
];

export const DUMMY_BOTS = REAL_NINA_BOTS;
