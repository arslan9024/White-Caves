// WhatsApp Bot sessions data for Nina

export const DUMMY_BOTS = [
  {
    id: 'bot-1',
    name: 'Lion0',
    number: '+971501234567',
    status: 'connected',
    qrCode: null,
    messagesProcessed: 1247,
    responseRate: 98.5,
    avgResponseTime: '2.3s',
    lastActive: '2 min ago',
    uptime: '99.8%',
    features: ['Auto-Reply', 'Lead Scoring', 'Appointment Booking']
  },
  {
    id: 'bot-2',
    name: 'Lion1',
    number: '+971507654321',
    status: 'disconnected',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WhatsAppSession',
    messagesProcessed: 856,
    responseRate: 95.2,
    avgResponseTime: '3.1s',
    lastActive: '1 hour ago',
    uptime: '87.3%',
    features: ['Auto-Reply', 'FAQ Bot']
  },
  {
    id: 'bot-3',
    name: 'Lion2',
    number: '+971509876543',
    status: 'pending',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WhatsAppNewSession',
    messagesProcessed: 0,
    responseRate: 0,
    avgResponseTime: '-',
    lastActive: 'Never',
    uptime: '0%',
    features: []
  }
];

export const CODE_MODULES = [
  {
    name: 'WhatsAppBot',
    expanded: true,
    files: [
      { name: 'CreatingNewWhatsAppClient.js', type: 'js', lines: 45 },
      { name: 'WhatsAppClientFunctions.js', type: 'js', lines: 234 },
      { name: 'MessageHandler.js', type: 'js', lines: 178 },
      { name: 'SessionManager.js', type: 'js', lines: 89 }
    ]
  },
  {
    name: 'Inputs',
    expanded: false,
    files: [
      { name: 'ArslanNumbers.js', type: 'js', lines: 25 },
      { name: 'NawalNumbers.js', type: 'js', lines: 18 },
      { name: 'BotConfig.js', type: 'js', lines: 42 }
    ]
  },
  {
    name: 'core-modules',
    expanded: false,
    files: [
      { name: 'LeadScoring.js', type: 'js', lines: 156 },
      { name: 'AutoReply.js', type: 'js', lines: 89 }
    ]
  }
];
