import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { LuxuryHeroSection } from '../components/homepage/Hero/LuxuryHeroSection';
import MarketStatsBanner from '../components/homepage/MarketStats/MarketStatsBanner';
import RentVsBuyCalculator from '../components/RentVsBuyCalculator';
import DubaiMap from '../components/DubaiMap';
import OffPlanTracker from '../components/OffPlanTracker';
import './HomePage.css';

const RED = '#EF4444';
const SLATE = '#1E293B';
const CARD_BG = '#F8FAFC';

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const isMD = user?.email === 'arslanmalikgoraha@gmail.com' || user?.role === 'managing-director';

  // React Event Toggles
  const [showStats, setShowStats] = useState<boolean>(true);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showOffPlan, setShowOffPlan] = useState<boolean>(false);

  return (
    <div className="home-page-container" style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      {/* Persistent Managing Director Access Bar when Logged In */}
      {isMD && (
        <div
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            color: '#FFFFFF',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #EF4444',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: RED, color: '#FFF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
              LEVEL 5 MASTER MD
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Arslan Malik — Managing Director Cockpit
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/crm')}
              style={{
                background: RED,
                color: '#FFF',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              }}
            >
              Open 14-Step CRM Deck →
            </button>
          </div>
        </div>
      )}

      {/* Main Luxury Hero Section */}
      <LuxuryHeroSection />

      {/* Dynamic React Trigger Event Controls */}
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button
            onClick={() => setShowStats(!showStats)}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: showStats ? `2px solid ${RED}` : '1px solid #E2E8F0',
              background: showStats ? 'rgba(239, 68, 68, 0.08)' : CARD_BG,
              color: showStats ? RED : SLATE,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📊 {showStats ? 'Hide Market Stats' : 'Show Market Stats'}
          </button>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: showCalculator ? `2px solid ${RED}` : '1px solid #E2E8F0',
              background: showCalculator ? 'rgba(239, 68, 68, 0.08)' : CARD_BG,
              color: showCalculator ? RED : SLATE,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🧮 {showCalculator ? 'Close Rent vs Buy' : 'Open Rent vs Buy Calculator'}
          </button>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: showMap ? `2px solid ${RED}` : '1px solid #E2E8F0',
              background: showMap ? 'rgba(239, 68, 68, 0.08)' : CARD_BG,
              color: showMap ? RED : SLATE,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🗺️ {showMap ? 'Close Dubai Map' : 'Explore Dubai Map'}
          </button>
          <button
            onClick={() => setShowOffPlan(!showOffPlan)}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: showOffPlan ? `2px solid ${RED}` : '1px solid #E2E8F0',
              background: showOffPlan ? 'rgba(239, 68, 68, 0.08)' : CARD_BG,
              color: showOffPlan ? RED : SLATE,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🏗️ {showOffPlan ? 'Close Off-Plan Tracker' : 'Open Off-Plan Tracker'}
          </button>
        </div>

        {/* Dynamic Toggled Components */}
        {showStats && (
          <div style={{ marginBottom: '32px', animation: 'fadeIn 300ms ease' }}>
            <MarketStatsBanner
              marketStats={{
                totalProperties: 9378,
                availableProperties: 4250,
                averagePrice: 2450000,
                portfolioValue: 18500000000,
                activeAgents: 60,
              }}
            />
          </div>
        )}

        {showCalculator && (
          <div style={{ marginBottom: '32px', padding: '24px', background: CARD_BG, borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Rent vs. Buy Calculator</h3>
              <button onClick={() => setShowCalculator(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>✕ Close</button>
            </div>
            <RentVsBuyCalculator />
          </div>
        )}

        {showMap && (
          <div style={{ marginBottom: '32px', padding: '24px', background: CARD_BG, borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Interactive Dubai Community Map</h3>
              <button onClick={() => setShowMap(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>✕ Close</button>
            </div>
            <DubaiMap />
          </div>
        )}

        {showOffPlan && (
          <div style={{ marginBottom: '32px', padding: '24px', background: CARD_BG, borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Off-Plan Developer Investment Tracker</h3>
              <button onClick={() => setShowOffPlan(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>✕ Close</button>
            </div>
            <OffPlanTracker />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
