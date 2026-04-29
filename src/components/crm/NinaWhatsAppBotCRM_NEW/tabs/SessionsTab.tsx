import React from 'react';
import { QrCode, Smartphone, Wifi, Check, X, Plus, Zap } from 'lucide-react';

interface Bot {
  id: string | number;
  name: string;
  number: string;
  status: string;
  qrCode?: string;
  messagesProcessed?: number;
  responseRate?: number;
  avgResponseTime?: string;
  uptime?: string;
  features?: string[];
}

interface SessionsData {
  bots: Bot[];
  showQRCode: boolean;
  setShowQRCode: (show: boolean) => void;
  qrCodeBot: Bot | null;
  setQRCodeBot: (bot: Bot | null) => void;
  getStatusColor: (status: string) => string;
}

interface SessionsTabProps {
  data: SessionsData;
}

export const SessionsTab: React.FC<SessionsTabProps> = ({ data }) => {
  const { bots, showQRCode, setShowQRCode, qrCodeBot, setQRCodeBot, getStatusColor } = data;

  const pendingBots = bots.filter((b: Bot) => b.status === 'pending' || !b.qrCode);

  return (
    <div className="sessions-tab">
      <div className="tab-header">
        <h3>Bot Sessions & QR Codes</h3>
        <button className="add-btn">
          <Plus size={18} /> New Session
        </button>
      </div>

      {pendingBots.length > 0 && (
        <div className="pending-sessions">
          <h4>Pending Sessions</h4>
          <div className="session-cards">
            {pendingBots.map((bot: Bot) => (
              <div key={bot.id} className="session-card pending">
                <div className="session-info">
                  <Smartphone size={24} />
                  <div>
                    <p className="session-name">{bot.name}</p>
                    <p className="session-number">{bot.number}</p>
                  </div>
                </div>
                {bot.qrCode && (
                  <button
                    className="qr-btn"
                    onClick={() => {
                      setQRCodeBot(bot);
                      setShowQRCode(true);
                    }}
                  >
                    <QrCode size={20} />
                  </button>
                )}
                <span className="status-badge pending">
                  <Zap size={14} /> Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="active-sessions">
        <h4>Active Sessions</h4>
        <div className="session-cards">
          {bots.filter((b: Bot) => b.status === 'connected').map((bot: Bot) => (
            <div key={bot.id} className="session-card active">
              <div className="session-info">
                <Wifi size={24} style={{ color: getStatusColor(bot.status) }} />
                <div>
                  <p className="session-name">{bot.name}</p>
                  <p className="session-number">{bot.number}</p>
                  <p className="session-uptime">Uptime: {bot.uptime}</p>
                </div>
              </div>
              <span className="status-badge active">
                <Check size={14} /> Connected
              </span>
            </div>
          ))}
        </div>
      </div>

      {showQRCode && qrCodeBot && (
        <div className="qr-modal">
          <div className="qr-content">
            <h4>Scan QR Code - {qrCodeBot.name}</h4>
            <img src={qrCodeBot.qrCode} alt="QR Code" className="qr-code-image" loading="lazy" width={200} height={200} />
            <p>Scan this QR code with WhatsApp to connect the bot</p>
            <button onClick={() => setShowQRCode(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
