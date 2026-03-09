import { useState, useCallback } from 'react';
import { DUMMY_BOTS, CODE_MODULES } from '../data/bots';
import { NINA_BOT_FEATURES } from '../data/features';

export const useBotData = () => {
  const [bots, setBots] = useState(DUMMY_BOTS);
  const [selectedBot, setSelectedBot] = useState(null);
  const [codeModules, setCodeModules] = useState(CODE_MODULES);
  const [expandedModule, setExpandedModule] = useState('WhatsAppBot');
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeBot, setQRCodeBot] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAddBot = useCallback(() => {
    const newBot = {
      id: `bot-${Date.now()}`,
      name: `Lion${bots.length}`,
      number: '+971500000000',
      status: 'pending',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WhatsAppNewSession',
      messagesProcessed: 0,
      responseRate: 0,
      avgResponseTime: '-',
      lastActive: 'Never',
      uptime: '0%',
      features: []
    };
    setBots([...bots, newBot]);
  }, [bots.length]);

  const handleDeleteBot = useCallback((botId) => {
    setBots(bots.filter(bot => bot.id !== botId));
    if (selectedBot?.id === botId) {
      setSelectedBot(null);
    }
  }, [bots, selectedBot]);

  const handleToggleBotStatus = useCallback((botId) => {
    setBots(prevBots =>
      prevBots.map(bot =>
        bot.id === botId
          ? {
              ...bot,
              status: bot.status === 'connected' ? 'disconnected' : 'connected',
              lastActive: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : bot
      )
    );
  }, []);

  const handleToggleModule = useCallback((moduleName) => {
    setCodeModules(prevModules =>
      prevModules.map(module =>
        module.name === moduleName
          ? { ...module, expanded: !module.expanded }
          : module
      )
    );
  }, []);

  const filteredBots = bots.filter(bot => {
    if (filterStatus === 'all') return true;
    return bot.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'disconnected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTotalMessagesProcessed = () => {
    return bots.reduce((sum, bot) => sum + bot.messagesProcessed, 0);
  };

  const getAverageResponseRate = () => {
    const rates = bots.filter(b => b.responseRate > 0).map(b => b.responseRate);
    return rates.length > 0 ? (rates.reduce((a, b) => a + b) / rates.length).toFixed(1) : 0;
  };

  const getConnectedBotCount = () => {
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
    features: NINA_BOT_FEATURES
  };
};
