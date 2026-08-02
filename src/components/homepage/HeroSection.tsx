import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/TranslationContext';
import { ArrowRight, Building2, ShieldCheck, Award } from 'lucide-react';

export const HeroSection: FC = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '85vh',
        backgroundColor: 'var(--wc-text-primary, #1E293B)',
        color: 'var(--wc-text-inverse, #FFFFFF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '120px 24px 60px 24px',
      }}
      data-testid="hero-section"
    >
      {/* Background Image Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', width: '100%', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--wc-red-primary, #EF4444)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '6px 16px',
              borderRadius: '30px',
              fontSize: '12px',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              marginBottom: '24px',
            }}
          >
            <Award size={14} />
            WHITE CAVES REAL ESTATE LLC — DUBAI
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: '800',
              lineHeight: 1.1,
              margin: '0 0 20px 0',
              color: 'var(--wc-text-inverse, #FFFFFF)',
              letterSpacing: '-0.02em',
            }}
          >
            {t('hero.title')}
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--wc-text-secondary, #94A3B8)',
              maxWidth: '800px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6,
            }}
          >
            {t('hero.subtitle')}
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'var(--wc-red-primary, #EF4444)',
                color: 'var(--wc-text-inverse, #FFFFFF)',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.25s ease-in-out',
              }}
            >
              <span>{t('hero.cta_explore')}</span>
              <ArrowRight size={18} />
            </button>

            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'transparent',
                color: 'var(--wc-text-inverse, #FFFFFF)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.25s ease-in-out',
              }}
            >
              <Building2 size={18} />
              <span>{t('hero.cta_contact')}</span>
            </button>
          </div>
        </motion.div>

        {/* Feature Highlights Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginTop: '60px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--wc-red-primary, #EF4444)' }}>9,378+</div>
            <div style={{ fontSize: '12px', color: 'var(--wc-text-secondary, #94A3B8)' }}>Managed Units in DAMAC Hills 2</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--wc-text-inverse, #FFFFFF)' }}>15-Min SLA</div>
            <div style={{ fontSize: '12px', color: 'var(--wc-text-secondary, #94A3B8)' }}>Portal Lead Ingestion Guarantee</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--wc-red-primary, #EF4444)' }}>100% Legal</div>
            <div style={{ fontSize: '12px', color: 'var(--wc-text-secondary, #94A3B8)' }}>DLD & RERA Form A/B/I Matrix</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
