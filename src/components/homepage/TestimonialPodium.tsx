import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RED = '#EF4444';
const SLATE = '#1E293B';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  rating: number;
  quote: string;
  avatar: string;
  verifiedDeal: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Alexander Volkov',
    role: 'Managing Director, Tech Ventures',
    location: 'Zurich, Switzerland',
    rating: 5,
    quote: 'White Caves secured a off-plan penthouse in Palm Jumeirah that yielded 14.8% net appreciation in 12 months. Arslan and his team are world-class.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verifiedDeal: 'Verified AED 18.5M Palm Jumeirah Deal',
  },
  {
    id: 2,
    name: 'Sophia Al-Hassan',
    role: 'Private Investor',
    location: 'Riyadh, Saudi Arabia',
    rating: 5,
    quote: 'The seamless digital contract execution and instant Golden Visa assistance made acquiring our 4-bedroom villa in DAMAC Hills 2 effortlessly smooth.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    verifiedDeal: 'Verified AED 4.2M Villa Acquisition',
  },
  {
    id: 3,
    name: 'David & Sarah Chen',
    role: 'Portfolio Managers',
    location: 'Singapore',
    rating: 5,
    quote: 'As international buyers, transparency is everything. White Caves provided real-time ROI telemetry and complete DLD regulatory audit support.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    verifiedDeal: 'Verified AED 9.8M Downtown Dubai Deal',
  },
];

export const TestimonialPodium: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextTestimonial = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const t = TESTIMONIALS[activeIdx];

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(239, 68, 68, 0.1)', color: RED, fontWeight: 800, fontSize: '0.8rem', marginBottom: '12px' }}>
          <span>⭐️ 5-STAR INVESTOR REVIEWS</span>
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: SLATE, margin: '0 0 10px' }}>
          Global Investor Testimonial Podium
        </h2>
        <p style={{ color: 'var(--text-secondary, #64748B)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
          Hear directly from high-net-worth investors, family offices, and buyers served by White Caves.
        </p>
      </div>

      <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '24px', padding: '40px', border: '2px solid rgba(239, 68, 68, 0.25)', boxShadow: '0 20px 40px rgba(239, 68, 68, 0.08)', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} style={{ color: 'var(--accent-gold, #F59E0B)', fontSize: '1.25rem' }}>★</span>
              ))}
            </div>

            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: SLATE, maxWidth: '800px', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 24px' }}>
              "{t.quote}"
            </p>

            <img
              src={t.avatar}
              alt={t.name}
              style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${RED}`, marginBottom: '12px' }}
            />

            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: SLATE, margin: '0 0 4px' }}>
              {t.name}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #64748B)', margin: '0 0 8px' }}>
              {t.role} · {t.location}
            </p>
            <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: RED, fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px', borderRadius: '9999px' }}>
              {t.verifiedDeal}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: '50%', left: '16px', right: '16px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <button
            onClick={prevTestimonial}
            style={{ pointerEvents: 'auto', background: '#FFFFFF', border: '1px solid #E2E8F0', width: '44px', height: '44px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem', color: SLATE }}
          >
            ←
          </button>
          <button
            onClick={nextTestimonial}
            style={{ pointerEvents: 'auto', background: '#FFFFFF', border: '1px solid #E2E8F0', width: '44px', height: '44px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem', color: SLATE }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};
