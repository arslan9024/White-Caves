import React from 'react';
import { useNavigate } from 'react-router-dom';

const RED = '#EF4444';
const SLATE = '#1E293B';

interface CommunityCard {
  id: string;
  name: string;
  tagline: string;
  avgPrice: string;
  roi: string;
  image: string;
  badge?: string;
}

const COMMUNITIES: CommunityCard[] = [
  {
    id: 'damac-hills-2',
    name: 'Life in DAMAC Hills 2',
    tagline: 'Water Town, Sports Town & Master Villas',
    avgPrice: 'AED 1.8M - 4.5M',
    roi: '8.4% Net Yield',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    badge: '🔥 Top Family Destination',
  },
  {
    id: 'downtown-dubai',
    name: 'Downtown Dubai',
    tagline: 'Burj Khalifa & Opera District Luxury Penthouses',
    avgPrice: 'AED 3.2M - 45M',
    roi: '6.8% Gross Yield',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    badge: '🌟 Icon of Dubai',
  },
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    tagline: 'World-Renowned Beachfront Mansions & Resorts',
    avgPrice: 'AED 8.5M - 120M',
    roi: '7.2% Capital Growth',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    badge: '💎 Ultra-Luxury Haven',
  },
  {
    id: 'dubai-marina',
    name: 'Dubai Marina & JBR',
    tagline: 'Waterfront Promenade & High-Rise Living',
    avgPrice: 'AED 1.6M - 9.2M',
    roi: '7.8% Rental Yield',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'business-bay',
    name: 'Business Bay & Canal',
    tagline: 'Corporate Towers & Luxury Canal-side Apartments',
    avgPrice: 'AED 1.4M - 7.5M',
    roi: '8.1% Rental Yield',
    image: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dubai-hills',
    name: 'Dubai Hills Estate',
    tagline: '18-Hole Championship Golf Course & Mansions',
    avgPrice: 'AED 2.9M - 28M',
    roi: '7.5% Net Yield',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
];

export const AreaGuideGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(239, 68, 68, 0.1)', color: RED, fontWeight: 800, fontSize: '0.8rem', marginBottom: '12px' }}>
          <span>🏙️ DUBAI MASTER COMMUNITIES</span>
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: SLATE, margin: '0 0 10px' }}>
          Curated Dubai Area Guides
        </h2>
        <p style={{ color: 'var(--text-secondary, #64748B)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
          Discover lifestyle highlights, rental returns, and neighborhood vibes in Dubai's premier enclaves.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {COMMUNITIES.map(area => (
          <div
            key={area.id}
            onClick={() => navigate(`/properties?community=${encodeURIComponent(area.name)}`)}
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              height: '320px',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.1)',
              cursor: 'pointer',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            {/* Community Cover Photo */}
            <img
              src={area.image}
              alt={area.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            />

            {/* Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
              }}
            />

            {/* Top Badge */}
            {area.badge && (
              <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#FFFFFF', color: RED, fontWeight: 800, fontSize: '0.75rem', padding: '6px 12px', borderRadius: '9999px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                {area.badge}
              </div>
            )}

            {/* Bottom Content Box */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', color: 'var(--white, #FFFFFF)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px' }}>
                {area.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-cbd5e1, #CBD5E1)', margin: '0 0 14px' }}>
                {area.tagline}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-94a3b8, #94A3B8)', display: 'block' }}>Avg Benchmark</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--white, #FFFFFF)', fontWeight: 700 }}>{area.avgPrice}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-94a3b8, #94A3B8)', display: 'block' }}>Est. Performance</span>
                  <strong style={{ fontSize: '0.9rem', color: RED, fontWeight: 800, background: '#FFFFFF', padding: '2px 8px', borderRadius: '6px' }}>
                    {area.roi}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaGuideGrid;
