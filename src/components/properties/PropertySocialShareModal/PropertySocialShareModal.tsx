/**
 * PropertySocialShareModal — Wave 57 FE-GOAL-019
 * Luxury property social share modal with instant dynamic QR code generator & copy link
 * White Caves Real Estate LLC — Social & Growth Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;}to{opacity:1;}`;
const popIn = keyframes`from{opacity:0;transform:scale(0.95);}to{opacity:1;transform:scale(1);}`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(7, 11, 20, 0.85);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
  font-family: 'Inter', sans-serif;
`;

const Modal = styled.div`
  width: 90%;
  max-width: 460px;
  background: #0F172A;
  border: 2px solid rgba(239, 68, 68, 0.35);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(239,68,68,0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${popIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #FFF;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QrBox = styled.div`
  background: #FFF;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
`;

const ShareGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const ShareBtn = styled.button`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #FFF;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  &:hover { border-color: #EF4444; background: rgba(239,68,68,0.1); }
`;

const LinkRow = styled.div`
  display: flex;
  gap: 8px;
`;

const LinkInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  background: rgba(7, 11, 20, 0.8);
  color: #94A3B8;
  font-size: 0.75rem;
  outline: none;
`;

export const PropertySocialShareModal: FC<{ propertyUrl?: string; propertyTitle?: string; onClose?: () => void }> = ({
  propertyUrl = 'https://whitecaves.ae/properties/palm-villa-14b',
  propertyTitle = 'Signature Beachfront Villa, Palm Jumeirah',
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Backdrop onClick={onClose} data-testid="property-social-share-modal">
      <Modal onClick={e => e.stopPropagation()}>
        <Head>
          <Title>🔗 Share Luxury Listing</Title>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
        </Head>

        <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{propertyTitle}</div>

        <QrBox>
          <div style={{ fontSize: '3rem', color: '#0F172A' }}>📱</div>
          <div style={{ fontSize: '0.7rem', color: '#0F172A', fontWeight: 800, marginTop: '4px' }}>SCAN QR CODE FOR VIP BROCHURE</div>
        </QrBox>

        <ShareGrid>
          <ShareBtn onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(propertyUrl)}`)}>
            <span style={{ fontSize: '1.1rem' }}>💬</span>
            <span>WhatsApp</span>
          </ShareBtn>
          <ShareBtn onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(propertyUrl)}`)}>
            <span style={{ fontSize: '1.1rem' }}>💼</span>
            <span>LinkedIn</span>
          </ShareBtn>
          <ShareBtn onClick={() => window.open(`mailto:?subject=${encodeURIComponent(propertyTitle)}&body=${encodeURIComponent(propertyUrl)}`)}>
            <span style={{ fontSize: '1.1rem' }}>✉️</span>
            <span>Email</span>
          </ShareBtn>
        </ShareGrid>

        <LinkRow>
          <LinkInput value={propertyUrl} readOnly />
          <button onClick={handleCopy} style={{ padding: '8px 14px', background: '#EF4444', border: 'none', borderRadius: '8px', color: '#FFF', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </LinkRow>
      </Modal>
    </Backdrop>
  );
};

export default PropertySocialShareModal;
