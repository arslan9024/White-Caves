import { useState, useCallback, useMemo, useEffect } from 'react';
import { REAL_NINA_BOTS, CODE_MODULES, Bot, CodeModule } from '../data/bots';
import { NINA_BOT_FEATURES } from '../data/features';

export const useBotData = () => {
  // Use REAL_NINA_BOTS dataset (Nina, Victoria, Sofia, Cassie)
  const [bots, setBots] = useState<Bot[]>(REAL_NINA_BOTS);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(REAL_NINA_BOTS[0]);
  const [codeModules, setCodeModules] = useState<CodeModule[]>(CODE_MODULES);
  const [expandedModule, setExpandedModule] = useState<string>('WhatsAppBot');
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [qrCodeBot, setQRCodeBot] = useState<Bot | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showFeatures, setShowFeatures] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Real API Sync to check live WhatsApp localAuth state
  const syncLiveSessionStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/whatsapp-engine/nina-md-primary/status');
      if (res.ok) {
        const data = await res.json();
        if (data.isConnected || data.status === 'READY') {
          setBots(prev => prev.map(b => b.id === 'bot-primary' ? { ...b, status: 'connected', lastActive: 'Just now' } : b));
        }
      }
    } catch {
      // Keep real dataset active
    }
  }, []);

  useEffect(() => {
    syncLiveSessionStatus();
    const interval = setInterval(syncLiveSessionStatus, 15000);
    return () => clearInterval(interval);
  }, [syncLiveSessionStatus]);

  const handleAddBot = useCallback(() => {
    setBots(prev => {
      const newBot: Bot = {
        id: `bot-${Date.now()}`,
        name: `Nina Assistant Unit ${prev.length + 1}`,
        number: '+971 50 576 0056',
        status: 'pending',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://wa.me/971505760056?text=WhiteCaves-Nina-NewSession',
        messagesProcessed: 0,
        responseRate: 100,
        avgResponseTime: '0.8s',
        lastActive: 'Just now',
        uptime: '100%',
        pairingCode: `WC-5760-056${prev.length + 1}`,
        features: ['Real-Time WhatsApp Event Stream', 'DAMAC Hills 2 Inventory Matching'],
      };
      return [...prev, newBot];
    });
  }, []);

  const handleDeleteBot = useCallback((botId: string) => {
    setBots(prev => prev.filter(bot => bot.id !== botId));
    setSelectedBot(prev => (prev?.id === botId ? null : prev));
  }, []);

  const handleToggleBotStatus = useCallback((botId: string) => {
    setBots(prevBots =>
      prevBots.map(bot =>
        bot.id === botId
          ? {
              ...bot,
              status: bot.status === 'connected' ? 'disconnected' : 'connected',
              lastActive: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : bot
      )
    );
  }, []);

  const handleToggleModule = useCallback((moduleName: string) => {
    setCodeModules(prevModules =>
      prevModules.map(module =>
        module.name === moduleName
          ? { ...module, expanded: !module.expanded }
          : module
      )
    );
  }, []);

  const filteredBots = useMemo(() => bots.filter(bot => {
    if (filterStatus === 'all') return true;
    return bot.status === filterStatus;
  }), [bots, filterStatus]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'disconnected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTotalMessagesProcessed = (): number => {
    return bots.reduce((sum, bot) => sum + bot.messagesProcessed, 0);
  };

  const getAverageResponseRate = (): number | string => {
    const rates = bots.filter(b => b.responseRate > 0).map(b => b.responseRate);
    return rates.length > 0 ? (rates.reduce((a, b) => a + b) / rates.length).toFixed(1) : 0;
  };

  const getConnectedBotCount = (): number => {
    return bots.filter(b => b.status === 'connected').length;
  };

  return {
    bots,
    selectedBot,
    setSelectedBot,
    codeModules,
    expandedModule,
    setExpandedModule,
    showQRCode,
    setShowQRCode,
    qrCodeBot,
    setQRCodeBot,
    showSettings,
    setShowSettings,
    showFeatures,
    setShowFeatures,
    filterStatus,
    setFilterStatus,
    handleAddBot,
    handleDeleteBot,
    handleToggleBotStatus,
    handleToggleModule,
    filteredBots,
    getStatusColor,
    getTotalMessagesProcessed,
    getAverageResponseRate,
    getConnectedBotCount,
    features: NINA_BOT_FEATURES,
  };
};
