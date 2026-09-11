import React, { useState } from 'react';
import {
  Sparkles, Loader2, Smartphone, Database, Type, MousePointer2,
  ArrowDown, Languages, Timer, Code2, Cookie, Columns, MessageCircle,
  Hash, Award, Map, Radio, FlaskConical, TestTube2, BookOpen, Gauge, ShieldCheck
} from 'lucide-react';
import { HeroPreloaderWidget } from '../hero/HeroPreloaderWidget/HeroPreloaderWidget';
import { HeroPWASplashWidget } from '../hero/HeroPWASplashWidget/HeroPWASplashWidget';
import { HeroCacheStrategyWidget } from '../hero/HeroCacheStrategyWidget/HeroCacheStrategyWidget';
import { HeroMicroCopyWidget } from '../hero/HeroMicroCopyWidget/HeroMicroCopyWidget';
import { HeroCursorWidget } from '../hero/HeroCursorWidget/HeroCursorWidget';
import { HeroScrollRevealWidget } from '../hero/HeroScrollRevealWidget/HeroScrollRevealWidget';
import { HeroI18NWidget } from '../hero/HeroI18NWidget/HeroI18NWidget';
import { HeroCountdownWidget } from '../hero/HeroCountdownWidget/HeroCountdownWidget';
import { HeroSchemaWidget } from '../hero/HeroSchemaWidget/HeroSchemaWidget';
import { HeroCookieConsentWidget } from '../hero/HeroCookieConsentWidget/HeroCookieConsentWidget';
import { HeroSplitScreenWidget } from '../hero/HeroSplitScreenWidget/HeroSplitScreenWidget';
import { HeroWhatsAppWidget } from '../hero/HeroWhatsAppWidget/HeroWhatsAppWidget';
import { HeroCountersWidget } from '../hero/HeroCountersWidget/HeroCountersWidget';
import { HeroAwardBadgesWidget } from '../hero/HeroAwardBadgesWidget/HeroAwardBadgesWidget';
import { HeroHeatMapWidget } from '../hero/HeroHeatMapWidget/HeroHeatMapWidget';
import { HeroWebSocketWidget } from '../hero/HeroWebSocketWidget/HeroWebSocketWidget';
import { HeroUnitTestWidget } from '../hero/HeroUnitTestWidget/HeroUnitTestWidget';
import { HeroE2ETestWidget } from '../hero/HeroE2ETestWidget/HeroE2ETestWidget';
import { HeroStorybookWidget } from '../hero/HeroStorybookWidget/HeroStorybookWidget';
import { HeroLighthouseWidget } from '../hero/HeroLighthouseWidget/HeroLighthouseWidget';
import { HeroReleaseGateWidget } from '../hero/HeroReleaseGateWidget/HeroReleaseGateWidget';
import './AssistantDashboard.css';

const TABS = [
  { id: 'preloader', label: 'Preloader', icon: Loader2 },
  { id: 'pwa', label: 'PWA Splash', icon: Smartphone },
  { id: 'cache', label: 'CDN Cache', icon: Database },
  { id: 'microcopy', label: 'Micro-Copy', icon: Type },
  { id: 'cursor', label: 'Cursor', icon: MousePointer2 },
  { id: 'scroll', label: 'Scroll Reveal', icon: ArrowDown },
  { id: 'i18n', label: 'i18n Keys', icon: Languages },
  { id: 'countdown', label: 'Countdown', icon: Timer },
  { id: 'schema', label: 'JSON-LD', icon: Code2 },
  { id: 'cookie', label: 'Cookie Consent', icon: Cookie },
  { id: 'split', label: 'Split Screen', icon: Columns },
  { id: 'whatsapp', label: 'WhatsApp Orb', icon: MessageCircle },
  { id: 'counters', label: 'Counters', icon: Hash },
  { id: 'awards', label: 'Award Badges', icon: Award },
  { id: 'heatmap', label: 'Heat Map', icon: Map },
  { id: 'websocket', label: 'WebSocket', icon: Radio },
  { id: 'unit', label: 'Unit Tests', icon: FlaskConical },
  { id: 'e2e', label: 'E2E Tests', icon: TestTube2 },
  { id: 'storybook', label: 'Storybook', icon: BookOpen },
  { id: 'lighthouse', label: 'Lighthouse', icon: Gauge },
  { id: 'gate', label: 'Release Gate', icon: ShieldCheck },
];

const TAB_WIDGETS = {
  preloader: HeroPreloaderWidget,
  pwa: HeroPWASplashWidget,
  cache: HeroCacheStrategyWidget,
  microcopy: HeroMicroCopyWidget,
  cursor: HeroCursorWidget,
  scroll: HeroScrollRevealWidget,
  i18n: HeroI18NWidget,
  countdown: HeroCountdownWidget,
  schema: HeroSchemaWidget,
  cookie: HeroCookieConsentWidget,
  split: HeroSplitScreenWidget,
  whatsapp: HeroWhatsAppWidget,
  counters: HeroCountersWidget,
  awards: HeroAwardBadgesWidget,
  heatmap: HeroHeatMapWidget,
  websocket: HeroWebSocketWidget,
  unit: HeroUnitTestWidget,
  e2e: HeroE2ETestWidget,
  storybook: HeroStorybookWidget,
  lighthouse: HeroLighthouseWidget,
  gate: HeroReleaseGateWidget,
};

const HeroSectionCRM = () => {
  const [activeTab, setActiveTab] = useState('preloader');
  const ActiveWidget = TAB_WIDGETS[activeTab];

  return (
    <div className="assistant-dashboard">
      <div className="assistant-header" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)' }}>
        <div className="header-content">
          <div className="header-title-area">
            <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #D4AF37, #F59E0B)' }}>
              <Sparkles size={24} color="#FFFFFF" />
            </div>
            <div>
              <h1 className="assistant-name">Hero Section — WAVE 50</h1>
              <p className="assistant-subtitle">21 Hero Section Feature Widgets</p>
            </div>
          </div>
        </div>
      </div>

      <div className="assistant-tabs" style={{ flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`assistant-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="assistant-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {ActiveWidget && <ActiveWidget />}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionCRM;
