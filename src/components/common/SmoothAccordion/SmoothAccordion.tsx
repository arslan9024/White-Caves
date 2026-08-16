/**
 * SmoothAccordion — Wave 64 FE-GOAL-086
 * Smooth animated accordion collapse/expand component for legal FAQ, compliance, and developer documentation
 * White Caves Real Estate LLC — UI/UX Suite
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  font-family: 'Inter', sans-serif;
`;

const AccordionItem = styled.div<{ $open: boolean }>`
  border: 1px solid ${p => p.$open ? 'rgba(239, 68, 68, 0.4)' : 'rgba(100, 116, 139, 0.2)'};
  border-radius: 12px;
  background: ${p => p.$open ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.6)'};
  overflow: hidden;
  transition: all 0.25s ease;
`;

const Header = styled.button`
  width: 100%;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  text-align: left;
  &:hover { color: #EF4444; }
`;

const Arrow = styled.span<{ $open: boolean }>`
  font-size: 0.8rem;
  color: ${p => p.$open ? '#EF4444' : '#94A3B8'};
  transform: ${p => p.$open ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.25s ease;
`;

const Content = styled.div<{ $open: boolean }>`
  max-height: ${p => p.$open ? '300px' : '0'};
  opacity: ${p => p.$open ? '1' : '0'};
  padding: ${p => p.$open ? '0 18px 16px' : '0 18px'};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-size: 0.78rem;
  color: #94A3B8;
  line-height: 1.5;
`;

export interface AccordionEntry {
  title: string;
  content: string;
}

export const SmoothAccordion: FC<{ entries?: AccordionEntry[] }> = ({
  entries = [
    {
      title: 'What is the statutory DLD transfer fee for Dubai freehold properties?',
      content: 'Dubai Land Department (DLD) mandates a 4% statutory transfer fee calculated on the gross purchase price, along with an AED 4,200 Registration Trustee admin fee paid via Manager Cheque.',
    },
    {
      title: 'Can foreign buyers obtain a 10-Year UAE Golden Visa through real estate?',
      content: 'Yes. Under UAE Cabinet Resolution No. 65 of 2022, foreign investors purchasing freehold real estate valued at AED 2,000,000 or more are eligible for a 10-Year Renewable Golden Visa.',
    },
    {
      title: 'How does the RERA Rental Calculator regulate annual lease increases?',
      content: 'Under Dubai Decree No. 43 of 2013, landlords can only increase rent if the current rate is at least 11% below the RERA official rental index, with statutory caps ranging from 5% to 20%.',
    },
  ],
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <Container data-testid="smooth-accordion">
      {entries.map((entry, idx) => {
        const isOpen = openIndex === idx;
        return (
          <AccordionItem key={idx} $open={isOpen}>
            <Header onClick={() => toggle(idx)} aria-expanded={isOpen}>
              <span>{entry.title}</span>
              <Arrow $open={isOpen}>▼</Arrow>
            </Header>
            <Content $open={isOpen}>
              {entry.content}
            </Content>
          </AccordionItem>
        );
      })}
    </Container>
  );
};

export default SmoothAccordion;
