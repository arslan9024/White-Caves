import React, { useState, useEffect } from 'react';
import { SessionsTabProps } from './sessions/types';
import { EngineTelemetryBanner } from './sessions/EngineTelemetryBanner';
import { PairingPortal } from './sessions/PairingPortal';
import { RegisteredBotsList } from './sessions/RegisteredBotsList';

export const SessionsTab: React.FC<SessionsTabProps> = ({ data }) => {
  const { bots } = data;
  const [selectedBotId, setSelectedBotId] = useState<string>('bot-primary');
  const [pairingMethod, setPairingMethod] = useState<'qr' | 'pairingCode'>('pairingCode');
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputPhoneNumber, setInputPhoneNumber] = useState('+971 50 576 0056');
  const [generatedPairingCode, setGeneratedPairingCode] = useState('WC-5760-056A');
  const [isGenerating, setIsGenerating] = useState(false);

  // Real-Time Socket/Polling State Simulation for whatsapp-web.js
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const [networkPing, setNetworkPing] = useState<number>(24);
  const [batteryLevel] = useState<number>(98);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSyncTime(new Date().toLocaleTimeString());
      setNetworkPing(Math.floor(18 + Math.random() * 12));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyPairingCode = () => {
    navigator.clipboard.writeText(generatedPairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleRegeneratePairingCode = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const codePart1 = Math.floor(1000 + Math.random() * 9000);
      const codePart2 = Math.floor(1000 + Math.random() * 9000);
      setGeneratedPairingCode(`WC-${codePart1}-${codePart2}`);
      setIsGenerating(false);
    }, 500);
  };

  // High-Resolution Crisp QR Code URL for Arslan's number +971 50 576 0056
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://wa.me/971505760056?text=WhiteCaves-Nina-AI-Core-Verified-Session`;

  return (
    <div className="sessions-tab" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <EngineTelemetryBanner
        lastSyncTime={lastSyncTime}
        networkPing={networkPing}
        batteryLevel={batteryLevel}
      />

      <PairingPortal
        pairingMethod={pairingMethod}
        onPairingMethodChange={setPairingMethod}
        inputPhoneNumber={inputPhoneNumber}
        onPhoneNumberChange={setInputPhoneNumber}
        generatedPairingCode={generatedPairingCode}
        isGenerating={isGenerating}
        copiedCode={copiedCode}
        onRegenerateCode={handleRegeneratePairingCode}
        onCopyCode={handleCopyPairingCode}
        qrCodeUrl={qrCodeUrl}
      />

      <RegisteredBotsList
        bots={bots}
        selectedBotId={selectedBotId}
        onSelectBot={setSelectedBotId}
      />
    </div>
  );
};
