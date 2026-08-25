import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Shield, Award, Zap, Phone, Mail, MapPin, Calculator, HelpCircle, ArrowRight, Star } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import PageMeta from '../components/seo/PageMeta';
import { WhiteCavesAgreementSigner } from '../components/public/WhiteCavesAgreementSigner';
import '../styles/luxuryDesignSystem.css';

export interface PlanItem {
  id: string;
  name: string;
  badge?: string;
  category: 'standard' | 'starter';
  subtitle: string;
  monthlyPrice: number;
  yearlyPrice: number;
  oneTimePrice?: number;
  commission: string;
  isYearlyOnly?: boolean;
  features: string[];
  popular?: boolean;
}

const PRICING_PLANS: PlanItem[] = [
  // STANDARD PLANS (100% COMMISSION)
  {
    id: 'basic-100',
    name: 'Basic Plan',
    badge: 'Standard 100% Plan',
    category: 'standard',
    subtitle: 'Designed for ambitious real estate brokers who want to establish themselves in the Dubai market.',
    monthlyPrice: 1500,
    yearlyPrice: 1000,
    commission: '100% Commission',
    features: [
      'Close Unlimited Deals',
      'Earn 100% Commission on All Deals',
      'Fast Commission Payouts (< 24 hrs)',
      'Access to All Major Dubai Developers',
      'Admin & Document Typing Support',
      'Nina AI Bot Assistant Access',
    ],
  },
  {
    id: 'premium-100',
    name: 'Premium Plan',
    badge: 'Brokers Card Included',
    category: 'standard',
    subtitle: 'Tailored for brokers holding a valid residence visa in Dubai, offering essential tools for success.',
    monthlyPrice: 2150,
    yearlyPrice: 2150,
    isYearlyOnly: true,
    popular: true,
    commission: '100% Commission',
    features: [
      'Close Unlimited Deals',
      'Earn 100% Commission',
      'Access to All Developers',
      'Admin & Escrow Support',
      'Fast Commission Payouts',
      'Official RERA Brokers Card',
      '5 Standard Featured Property Listings',
      'Branded White Caves Business Cards',
      'Branded White Caves Corporate Email',
    ],
  },
  {
    id: 'premium-plus-100',
    name: 'Premium Plus Plan',
    badge: 'UAE Visa + RERA Card',
    category: 'standard',
    subtitle: 'Secure a Dubai residence visa and gain access to a RERA card for official recognition and full legal standing.',
    monthlyPrice: 2500,
    yearlyPrice: 2500,
    isYearlyOnly: true,
    commission: '100% Commission',
    features: [
      'Close Unlimited Deals',
      'Earn 100% Commission',
      'Access to All Developers',
      'Admin & Legal Support',
      'Fast Commission Payouts',
      'Official RERA Brokers Card',
      'UAE Residence Visa & Emirates ID Sponsorship',
      '5 Standard Featured Property Listings',
      'Branded Business Card & Email',
    ],
  },
  {
    id: 'one-time-100',
    name: 'One Time Deal',
    badge: 'Single Transaction',
    category: 'standard',
    subtitle: 'Highlight your properties to potential clients and close a single high-value deal in a competitive market.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    oneTimePrice: 8000,
    commission: '100% Commission',
    features: [
      'Close 1 High-Value Deal',
      'Earn 100% Commission',
      'Full Admin Support',
      'Fast Commission Payout',
      'Legal Escrow Guidance',
    ],
  },

  // STARTER PLANS (COMMISSION SPLITS)
  {
    id: 'starter-95-5',
    name: '95/5 Split Plan',
    badge: 'High Retention',
    category: 'starter',
    subtitle: 'Maximize deal earnings with 95% commission retention and low monthly subscription fees.',
    monthlyPrice: 500,
    yearlyPrice: 475,
    commission: '95% Commission',
    features: [
      'Close Unlimited Deals',
      'Earn 95% Commission (5% Agency Split)',
      'Access to All Developers',
      'Admin & Typing Support',
      'Fast Commission Payouts',
    ],
  },
  {
    id: 'starter-90-10',
    name: '90/10 Split Plan',
    badge: 'Popular Starter',
    category: 'starter',
    subtitle: 'Balanced tier for active brokers wanting full developer inventory access and dedicated admin backing.',
    monthlyPrice: 350,
    yearlyPrice: 300,
    commission: '90% Commission',
    features: [
      'Close Unlimited Deals',
      'Earn 90% Commission (10% Agency Split)',
      'Access to All Developers',
      'Admin & Typing Support',
      'Fast Commission Payouts',
    ],
  },
  {
    id: 'starter-85-15',
    name: '85/15 Split Plan',
    badge: 'Entry Level',
    category: 'starter',
    subtitle: 'Ideal for part-time brokers or new agents building their portfolio in Dubai real estate.',
    monthlyPrice: 200,
    yearlyPrice: 150,
    commission: '85% Commission',
    features: [
      'Close Unlimited Deals',
      'Earn 85% Commission (15% Agency Split)',
      'Access to All Developers',
      'Admin & Typing Support',
      'Fast Commission Payouts',
    ],
  },
  {
    id: 'starter-75-25',
    name: '75/25 Split Plan',
    badge: '100% Free Plan',
    category: 'starter',
    subtitle: 'Zero monthly fees! Start your broker journey with full developer access and zero risk.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    commission: '75% Commission',
    features: [
      'Close Unlimited Deals',
      'Earn 75% Commission (25% Agency Split)',
      'Access to All Developers',
      'Admin & Typing Support',
      'Fast Commission Payouts',
      'AED 0 Monthly Subscription Fee',
    ],
  },
];

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [activeTabCategory, setActiveTabCategory] = useState<'all' | 'standard' | 'starter'>('all');
  const [selectedPlanModal, setSelectedPlanModal] = useState<PlanItem | null>(null);

  // Calculator State
  const [annualSalesVolume, setAnnualSalesVolume] = useState<number>(2000000); // AED 2M
  const [commissionRate, setCommissionRate] = useState<number>(2); // 2% avg commission

  const totalGrossCommission = (annualSalesVolume * commissionRate) / 100;

  const filteredPlans = PRICING_PLANS.filter(plan => {
    if (activeTabCategory === 'all') return true;
    return plan.category === activeTabCategory;
  });

  return (
    <PublicLayout>
      <PageMeta
        title="Broker Pricing & Commission Split Plans | White Caves Real Estate"
        description="Choose your White Caves broker membership plan. 100% commission retention, 95/5, 90/10, 85/15, and FREE 75/25 plans with UAE residence visa & RERA card support."
      />

      {/* TOP PARTNER PROMO BANNER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #06B6D4 100%)',
          color: '#FFFFFF',
          padding: '12px 24px',
          textAlign: 'center',
          fontSize: '0.88rem',
          fontWeight: 800,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 16px rgba(6, 182, 212, 0.25)',
        }}
      >
        <span>🎉 White Caves subscribers enjoy <strong>5% OFF Premium Property Leads</strong> through our partnership with Dubai Property Leads!</span>
        <button
          onClick={() => window.open('https://wa.me/971505760056?text=I%20want%20to%20claim%205%25%20OFF%20Property%20Leads', '_blank')}
          style={{
            background: '#D4AF37',
            color: '#0F172A',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '0.78rem',
            fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          Claim Offer ➔
        </button>
      </div>

      <div style={{ background: 'var(--color-0f172a, #0F172A)', color: 'var(--white, #FFFFFF)', paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* HEADER SECTION */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="wc-luxury-italic-gold" style={{ fontSize: '1rem', display: 'block', marginBottom: '8px' }}>
              White Caves Compensation & Brokerage Plans
            </span>
            <h1 className="wc-luxury-serif-title" style={{ fontSize: '2.5rem', margin: '0 0 1rem', color: 'var(--white, #FFFFFF)' }}>
              In-House 50/50 Policy & <span className="wc-luxury-italic-cyan">Private Freelance Access</span>
            </h1>
            <p style={{ color: 'var(--color-94a3b8, #94A3B8)', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              All employed in-house brokers operate under our standard <strong>50/50 Commission Split Policy</strong> (full salary, visa, & admin support). Freelance brokers may request restricted private membership packages below.
            </p>

            {/* HIRED EMPLOYEE VS FREELANCE BANNER */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '800px', margin: '0 auto 2rem', textAlign: 'left' }}>
              <div style={{ background: 'var(--color-1e293b, #1E293B)', border: '1.5px solid var(--accent-green, #10B981)', borderRadius: '14px', padding: '1.25rem' }}>
                <span style={{ background: 'var(--color-ecfdf5, #ECFDF5)', color: 'var(--color-047857, #047857)', fontSize: '0.72rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Hired In-House Employees
                </span>
                <h4 style={{ margin: '6px 0 2px', fontSize: '1.1rem', fontWeight: 900, color: 'var(--white, #FFFFFF)' }}>
                  Standard 50/50 Commission Split
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-94a3b8, #94A3B8)', lineHeight: 1.45 }}>
                  50% Broker / 50% Agency. Full salary, UAE visa, health insurance, developer access, and admin backing. AED 0 fees.
                </p>
              </div>

              <div style={{ background: 'var(--color-1e293b, #1E293B)', border: '1.5px solid var(--color-06b6d4, #06B6D4)', borderRadius: '14px', padding: '1.25rem' }}>
                <span style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--color-38bdf8, #38BDF8)', fontSize: '0.72rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Restricted Freelance Access
                </span>
                <h4 style={{ margin: '6px 0 2px', fontSize: '1.1rem', fontWeight: 900, color: 'var(--white, #FFFFFF)' }}>
                  Private Freelance Membership
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-94a3b8, #94A3B8)', lineHeight: 1.45 }}>
                  100%, 95/5, and 90/10 plans. Restricted access available only via private Managing Director invitation & approval.
                </p>
              </div>
            </div>

            {/* CORE OPPORTUNITY FEATURES (VISA SPONSORSHIP, TECH SUPPORT, FLEXIBILITY) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', maxWidth: '1000px', margin: '0 auto 2rem', textAlign: 'left' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '1.25rem' }}>
                <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '6px' }}>🛂</span>
                <h5 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 900, color: 'var(--color-38bdf8, #38BDF8)' }}>
                  Performance Visa Sponsorship
                </h5>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)', lineHeight: 1.45 }}>
                  Earn full UAE residence visa sponsorship after successfully closing <strong>1 Sale Deal OR 2 Rental Contracts</strong>.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '1.25rem' }}>
                <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '6px' }}>🛠️</span>
                <h5 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 900, color: 'var(--accent-green, #10B981)' }}>
                  Full Tech & Support Services
                </h5>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)', lineHeight: 1.45 }}>
                  Even on high-split models, receive complete training, admin backing, DLD title deed tools, and Nina AI lead technology access.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '1.25rem' }}>
                <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '6px' }}>🗽</span>
                <h5 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 900, color: 'var(--color-d4af37, #D4AF37)' }}>
                  Entrepreneurial Flexibility
                </h5>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)', lineHeight: 1.45 }}>
                  Manage your own client relationships and work hours as an independent entrepreneur under our licensed RERA umbrella.
                </p>
              </div>
            </div>

            {/* BILLING TOGGLE */}
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--color-1e293b, #1E293B)', padding: '6px', borderRadius: '9999px', margin: '2rem 0 1rem', border: '1px solid var(--color-334155, #334155)' }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  background: billingCycle === 'monthly' ? '#06B6D4' : 'transparent',
                  color: billingCycle === 'monthly' ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '10px 24px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Billed Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                style={{
                  background: billingCycle === 'yearly' ? '#06B6D4' : 'transparent',
                  color: billingCycle === 'yearly' ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '10px 24px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Billed Annually</span>
                <span style={{ background: 'var(--color-d4af37, #D4AF37)', color: 'var(--color-0f172a, #0F172A)', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: '6px' }}>
                  SAVE UP TO 33%
                </span>
              </button>
            </div>

            {/* CATEGORY TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
              {[
                { id: 'all', label: 'All Plans' },
                { id: 'standard', label: '⭐ Standard 100% Commission Plans' },
                { id: 'starter', label: '🚀 Starter Commission Split Plans' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabCategory(tab.id as any)}
                  className={`wc-luxury-pill-chip ${activeTabCategory === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* PRICING CARDS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {filteredPlans.map(plan => {
              const displayPrice = plan.oneTimePrice
                ? plan.oneTimePrice
                : billingCycle === 'yearly'
                ? plan.yearlyPrice
                : plan.monthlyPrice;

              return (
                <div
                  key={plan.id}
                  className="wc-luxury-glass-card"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: plan.popular ? '2px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: plan.popular ? '0 10px 40px rgba(212, 175, 55, 0.25)' : 'none',
                    position: 'relative',
                  }}
                >
                  {plan.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-14px',
                        right: '20px',
                        background: '#D4AF37',
                        color: '#0F172A',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                      }}
                    >
                      ★ Most Popular Broker Tier
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-06b6d4, #06B6D4)', textTransform: 'uppercase' }}>
                        {plan.badge || plan.commission}
                      </span>
                      <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--color-38bdf8, #38BDF8)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                        {plan.commission}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.5rem', color: 'var(--white, #FFFFFF)' }}>
                      {plan.name}
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-94a3b8, #94A3B8)', lineHeight: 1.5, marginBottom: '1.5rem', minHeight: '42px' }}>
                      {plan.subtitle}
                    </p>

                    {/* PRICE DISPLAY */}
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1.25rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-94a3b8, #94A3B8)', fontWeight: 700 }}>AED </span>
                      <strong style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--white, #FFFFFF)', fontFamily: 'monospace' }}>
                        {displayPrice.toLocaleString()}
                      </strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
                        {plan.oneTimePrice ? ' / one time' : billingCycle === 'yearly' ? ' / mo (billed annually)' : ' / mo'}
                      </span>
                    </div>

                    {/* INCLUDED FEATURES */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #CBD5E1)', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                        What's Included
                      </span>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {plan.features.map((feat, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary, #E2E8F0)', lineHeight: 1.4 }}>
                            <CheckCircle2 size={16} color="var(--accent-green, #10B981)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* REQUEST FREELANCE ACCESS CTA BUTTON */}
                  <button
                    onClick={() => setSelectedPlanModal(plan)}
                    style={{
                      width: '100%',
                      background: plan.popular ? '#D4AF37' : 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                      color: plan.popular ? '#0F172A' : '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 20px',
                      fontSize: '0.88rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Request Freelance Access ➔
                  </button>
                </div>
              );
            })}
          </div>

          {/* ─── INTERACTIVE BROKER EARNINGS CALCULATOR ─── */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '2px solid #06B6D4',
              borderRadius: '20px',
              padding: '2.25rem',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              marginBottom: '4rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Calculator size={28} color="#06B6D4" />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-06b6d4, #06B6D4)', textTransform: 'uppercase' }}>Interactive Broker Earnings Simulator</span>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--white, #FFFFFF)' }}>
                  Calculate Your Take-Home Earnings in Dubai
                </h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-secondary, #CBD5E1)', marginBottom: '6px' }}>
                  Annual Property Sales Volume (AED): <strong style={{ color: 'var(--color-38bdf8, #38BDF8)' }}>AED {annualSalesVolume.toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min="500000"
                  max="20000000"
                  step="500000"
                  value={annualSalesVolume}
                  onChange={e => setAnnualSalesVolume(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-06b6d4, #06B6D4)', marginBottom: '1.25rem' }}
                />

                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-secondary, #CBD5E1)', marginBottom: '6px' }}>
                  Average Gross Commission Rate (%): <strong style={{ color: 'var(--color-d4af37, #D4AF37)' }}>{commissionRate}%</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={commissionRate}
                  onChange={e => setCommissionRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-d4af37, #D4AF37)' }}
                />

                <div style={{ marginTop: '1.25rem', background: 'rgba(255, 255, 255, 0.05)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Total Gross Commission Generated:</span>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--white, #FFFFFF)', display: 'block', fontFamily: 'monospace' }}>
                    AED {totalGrossCommission.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* EARNINGS COMPARISON BREAKDOWN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: '100% Commission Plan', split: 1.0, color: '#10B981' },
                  { name: '95/5 Split Plan', split: 0.95, color: '#38BDF8' },
                  { name: '90/10 Split Plan', split: 0.90, color: '#60A5FA' },
                  { name: '85/15 Split Plan', split: 0.85, color: '#F59E0B' },
                  { name: '75/25 Split Plan (FREE)', split: 0.75, color: '#94A3B8' },
                ].map((item, i) => {
                  const brokerTakeHome = totalGrossCommission * item.split;
                  return (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: item.color }}>{item.name}</span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--white, #FFFFFF)', fontFamily: 'monospace' }}>
                        AED {brokerTakeHome.toLocaleString()}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* OFFICIAL REAL ESTATE SERVICES AGREEMENT SIGNER */}
          <div style={{ marginBottom: '3.5rem' }}>
            <WhiteCavesAgreementSigner />
          </div>

          {/* CONTACT & FAQ SECTION */}
          <div style={{ textAlign: 'center', background: 'var(--color-1e293b, #1E293B)', borderRadius: '18px', padding: '2.5rem', border: '1px solid var(--color-334155, #334155)' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 900, color: 'var(--white, #FFFFFF)' }}>
              Have More Questions or Need Custom Broker Licensing?
            </h3>
            <p style={{ color: 'var(--color-94a3b8, #94A3B8)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Chat directly with our broker acquisition team at Ontario Tower – Business Bay, Dubai.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary, #CBD5E1)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#06B6D4" /> Office 1503, Ontario Tower – Business Bay, Dubai, UAE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={16} color="#10B981" /> WhatsApp: +971 50 576 0056
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} color="#D4AF37" /> Email: info@whitecaves.ae
              </div>
            </div>

            <button
              onClick={() => window.open('https://wa.me/971505760056?text=Hi%20White%20Caves%2C%20I%20want%20to%20join%20as%20a%20Broker', '_blank')}
              style={{
                background: '#25D366',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 28px',
                fontSize: '0.92rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
              }}
            >
              💬 Chat With Us on WhatsApp (+971 50 576 0056)
            </button>
          </div>

        </div>
      </div>

      {/* PLAN SELECTION MODAL */}
      {selectedPlanModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: '#0F172A',
              border: '2px solid #06B6D4',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '480px',
              width: '100%',
              color: '#FFFFFF',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 900 }}>
              Join White Caves on {selectedPlanModal.name}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-94a3b8, #94A3B8)', marginBottom: '1.25rem' }}>
              {selectedPlanModal.subtitle}
            </p>

            <div style={{ background: 'var(--color-1e293b, #1E293B)', padding: '14px', borderRadius: '12px', border: '1px solid var(--color-334155, #334155)', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-38bdf8, #38BDF8)', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>SELECTED PLAN</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--white, #FFFFFF)' }}>{selectedPlanModal.name} ({selectedPlanModal.commission})</strong>
              <div style={{ fontSize: '1.1rem', color: 'var(--accent-green, #10B981)', fontWeight: 900, marginTop: '4px' }}>
                AED {selectedPlanModal.oneTimePrice ? selectedPlanModal.oneTimePrice.toLocaleString() : (billingCycle === 'yearly' ? selectedPlanModal.yearlyPrice : selectedPlanModal.monthlyPrice).toLocaleString()}
                <span style={{ fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)', fontWeight: 400 }}> {selectedPlanModal.oneTimePrice ? 'one time' : '/ mo'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  window.open(`https://wa.me/971505760056?text=Hi%20Arslan%2C%20I%20want%20to%20subscribe%20to%20White%20Caves%20${encodeURIComponent(selectedPlanModal.name)}%20(${selectedPlanModal.commission})`, '_blank');
                  setSelectedPlanModal(null);
                }}
                style={{
                  background: '#25D366',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                💬 Complete Subscription via WhatsApp
              </button>

              <button
                onClick={() => setSelectedPlanModal(null)}
                style={{
                  background: '#334155',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default PricingPage;
