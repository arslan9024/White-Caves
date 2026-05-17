import React, { useState } from 'react';
import { Globe, FileText, CheckCircle, Clock } from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const TRANSLATIONS = [
  {
    id: 1,
    doc: 'Sale & Purchase Agreement — Palm Villa G12',
    from: 'English',
    to: 'Arabic',
    status: 'completed',
    pages: 12,
    requestedBy: 'Sophia',
    time: '30m ago',
  },
  {
    id: 2,
    doc: 'Property Listing — Marina Gate 2BR',
    from: 'English',
    to: 'Russian',
    status: 'in_progress',
    pages: 2,
    requestedBy: 'Olivia',
    time: '1h ago',
  },
  {
    id: 3,
    doc: 'Tenancy Contract — JVC Studio',
    from: 'English',
    to: 'Chinese',
    status: 'completed',
    pages: 8,
    requestedBy: 'Daisy',
    time: '2h ago',
  },
  {
    id: 4,
    doc: 'KYC Form — Client Fatima Al Suwaidi',
    from: 'Arabic',
    to: 'English',
    status: 'pending',
    pages: 3,
    requestedBy: 'Laila',
    time: '3h ago',
  },
  {
    id: 5,
    doc: 'Investment Brochure — Emirates Hills',
    from: 'English',
    to: 'French',
    status: 'completed',
    pages: 6,
    requestedBy: 'Maven',
    time: '4h ago',
  },
];

const LANGUAGES = [
  { code: 'AR', name: 'Arabic', flag: '🇦🇪', docs: 18, rtl: true },
  { code: 'ZH', name: 'Chinese', flag: '🇨🇳', docs: 9 },
  { code: 'RU', name: 'Russian', flag: '🇷🇺', docs: 7 },
  { code: 'FR', name: 'French', flag: '🇫🇷', docs: 5 },
  { code: 'HI', name: 'Hindi', flag: '🇮🇳', docs: 4 },
  { code: 'UR', name: 'Urdu', flag: '🇵🇰', docs: 3 },
];

const statusColors = { completed: '#22C55E', in_progress: '#3B82F6', pending: '#F59E0B' };

const MiraCRM = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [inputText, setInputText] = useState(
    'Welcome to White Caves Real Estate. We specialise in luxury Dubai properties.'
  );
  const [fromLang, setFromLang] = useState('English');
  const [toLang, setToLang] = useState('Arabic');

  const demoTranslations = {
    Arabic: 'مرحباً بكم في شركة وايت كيفز للعقارات. نحن متخصصون في العقارات الفاخرة في دبي.',
    Chinese: '欢迎来到白洞房地产。我们专注于迪拜豪华房产。',
    Russian:
      'Добро пожаловать в White Caves Real Estate. Мы специализируемся на элитной недвижимости Дубая.',
    French:
      "Bienvenue chez White Caves Real Estate. Nous sommes spécialisés dans l'immobilier de luxe à Dubaï.",
    Hindi:
      'व्हाइट केव्स रियल एस्टेट में आपका स्वागत है। हम दुबई की लग्जरी संपत्तियों में विशेषज्ञ हैं।',
    Urdu: 'وائٹ کیوز ریل اسٹیٹ میں خوش آمدید۔ ہم دبئی میں لگژری پراپرٹیز میں مہارت رکھتے ہیں۔',
  };

  const tabs = [
    { id: 'queue', label: '📄 Translation Queue' },
    { id: 'live', label: '⚡ Live Translate' },
    { id: 'languages', label: '🌍 Languages' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard mira">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)' }}
        >
          <Globe size={28} />
        </div>
        <div className="assistant-info">
          <h2>Mira — Multilingual Translation Engine</h2>
          <p>Real-time Arabic ↔ English and 6-language document translation for Dubai clients</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>6 Languages Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
          >
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{TRANSLATIONS.length}</span>
            <span className="stat-label">Jobs Today</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}
          >
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {TRANSLATIONS.filter(t => t.status === 'completed').length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(227,30,36,0.15)', color: '#E31E24' }}
          >
            <Globe size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">6</span>
            <span className="stat-label">Languages</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
          >
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">12m</span>
            <span className="stat-label">Avg Turnaround</span>
          </div>
        </div>
      </div>

      <div className="crm-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`crm-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'queue' && (
        <div className="tab-content">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>From</th>
                <th>To</th>
                <th>Pages</th>
                <th>Requested By</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSLATIONS.map(t => (
                <tr key={t.id}>
                  <td
                    style={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <strong>{t.doc}</strong>
                  </td>
                  <td>{t.from}</td>
                  <td>{t.to}</td>
                  <td>{t.pages}</td>
                  <td>{t.requestedBy}</td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{t.time}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: `${statusColors[t.status]}22`,
                        color: statusColors[t.status],
                      }}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'live' && (
        <div className="tab-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, color: '#6b7280' }}>From:</label>
                <select
                  value={fromLang}
                  onChange={e => setFromLang(e.target.value)}
                  style={{
                    fontSize: 13,
                    padding: '4px 8px',
                    borderRadius: 6,
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <option>English</option>
                  {LANGUAGES.map(l => (
                    <option key={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  fontSize: 14,
                  resize: 'vertical',
                }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, color: '#6b7280' }}>To:</label>
                <select
                  value={toLang}
                  onChange={e => setToLang(e.target.value)}
                  style={{
                    fontSize: 13,
                    padding: '4px 8px',
                    borderRadius: 6,
                    border: '1px solid #e5e7eb',
                  }}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div
                dir={toLang === 'Arabic' || toLang === 'Urdu' ? 'rtl' : 'ltr'}
                style={{
                  width: '100%',
                  minHeight: 140,
                  padding: 12,
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  fontSize: 14,
                  background: '#f9fafb',
                  lineHeight: 1.8,
                }}
              >
                {/* eslint-disable-next-line security/detect-object-injection */}
                {demoTranslations[toLang] || 'Translation not available for demo.'}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
            Demo translation. Production uses DeepL + custom real-estate terminology dictionary.
          </div>
        </div>
      )}

      {activeTab === 'languages' && (
        <div className="tab-content">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 14,
            }}
          >
            {LANGUAGES.map(l => (
              <div
                key={l.code}
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{l.flag}</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{l.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  {l.docs} documents this month
                </div>
                {l.rtl && (
                  <span
                    style={{
                      marginTop: 8,
                      display: 'inline-block',
                      background: '#EEF2FF',
                      color: '#4F46E5',
                      borderRadius: 20,
                      padding: '2px 8px',
                      fontSize: 11,
                    }}
                  >
                    RTL
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="mira" color="#10B981" assistantName="Mira" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="mira" color="#10B981" assistantName="Mira" />
      )}
    </div>
  );
};

export default MiraCRM;
