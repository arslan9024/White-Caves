/**
 * SovereignFooter — Wave 61 FE-GOAL-055
 * Master sovereign footer with Dubai skyline aesthetics, statutory DET license numbers, and RERA registration
 * White Caves Real Estate LLC — Navigation & Branding Suite
 */
import React, { FC } from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  width: 100%;
  background: #070B14;
  border-top: 2px solid rgba(239, 68, 68, 0.25);
  padding: 48px 20px 24px;
  font-family: 'Inter', sans-serif;
  color: #94A3B8;
`;

const FooterGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 32px;
  @media (max-width: 860px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BrandTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 900;
  color: #FFF;
  span { color: #EF4444; }
`;

const ColTitle = styled.div`
  font-size: 0.82rem;
  font-weight: 800;
  color: #FFF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FooterLink = styled.a`
  font-size: 0.78rem;
  color: #94A3B8;
  text-decoration: none;
  transition: color 0.2s ease;
  &:hover { color: #EF4444; }
`;

const BottomBar = styled.div`
  max-width: 1200px;
  margin: 36px auto 0;
  padding-top: 20px;
  border-top: 1px solid rgba(100, 116, 139, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  @media (max-width: 600px) { flex-direction: column; gap: 8px; text-align: center; }
`;

export const SovereignFooter: FC = () => {
  return (
    <FooterWrapper data-testid="sovereign-footer">
      <FooterGrid>
        <Col>
          <BrandTitle>WHITE <span>CAVES</span></BrandTitle>
          <div style={{ fontSize: '0.75rem', lineHeight: 1.5, color: 'var(--text-secondary, #64748B)' }}>
            White Caves Real Estate LLC is an ultra-prime brokerage and institutional asset management agency in Dubai, UAE.
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-red, #EF4444)', fontWeight: 700, marginTop: '6px' }}>
            DET Commercial License #1388443 · RERA ORN #44483
          </div>
        </Col>

        <Col>
          <ColTitle>Properties</ColTitle>
          <FooterLink href="/properties?cat=villa">Luxury Villas</FooterLink>
          <FooterLink href="/properties?cat=penthouse">Sky Penthouses</FooterLink>
          <FooterLink href="/properties?cat=offplan">Off-Plan Projects</FooterLink>
          <FooterLink href="/properties?cat=commercial">Commercial Freehold</FooterLink>
        </Col>

        <Col>
          <ColTitle>Sovereign Suite</ColTitle>
          <FooterLink href="/goals">100 Goals Showcase</FooterLink>
          <FooterLink href="/profile">Managing Director Desk</FooterLink>
          <FooterLink href="/crm">Nina AI CRM Platform</FooterLink>
          <FooterLink href="/tools">DLD Fee & ROI Calculator</FooterLink>
        </Col>

        <Col>
          <ColTitle>Compliance & Legal</ColTitle>
          <FooterLink href="/legal/terms">Terms of Service</FooterLink>
          <FooterLink href="/legal/privacy">UAE PDPL Privacy Policy</FooterLink>
          <FooterLink href="/legal/rera">RERA Form 12 Eviction Disclosures</FooterLink>
          <FooterLink href="/legal/escrow">Escrow Law No. 8/2007</FooterLink>
        </Col>
      </FooterGrid>

      <BottomBar>
        <div>© 2024–2026 White Caves Real Estate LLC. All Rights Reserved.</div>
        <div style={{ color: 'var(--text-secondary, #64748B)' }}>Architected on AEGIS Sovereign OS V3.0 · Zero-Trust DESC Certified</div>
      </BottomBar>
    </FooterWrapper>
  );
};

export default SovereignFooter;
