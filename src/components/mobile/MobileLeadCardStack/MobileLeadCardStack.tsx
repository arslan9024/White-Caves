/**
 * MobileLeadCardStack.tsx — View Layer (4-Way Component Architecture)
 * Tinder-style swipeable lead card stack for rapid mobile CRM triage.
 */

import React, { FC } from 'react';
import { Phone, MessageCircle, MapPin, DollarSign, Clock } from 'lucide-react';
import { useMobileLeadCardStackLogic } from './logic/MobileLeadCardStack.logic';
import {
  StackWrapper,
  Card,
  StageBadge,
  LeadName,
  Meta,
  ActionRow,
  ActionBtn,
} from './styles/MobileLeadCardStack.style';

export const MobileLeadCardStack: FC = () => {
  const { cards, stageColor, handleSwipeLeft, handleSwipeRight } = useMobileLeadCardStackLogic();

  if (cards.length === 0) {
    return (
      <StackWrapper data-testid="mobile-lead-card-stack">
        <Card $offset={0} $active>
          <LeadName style={{ textAlign: 'center', marginTop: 80 }}>All leads reviewed 🎉</LeadName>
        </Card>
      </StackWrapper>
    );
  }

  return (
    <StackWrapper data-testid="mobile-lead-card-stack">
      {cards.slice(0, 3).map((card, i) => (
        <Card key={card.id} $offset={i} $active={i === 0}>
          <StageBadge $color={stageColor(card.stage)}>{card.stage}</StageBadge>
          <LeadName>{card.name}</LeadName>
          <Meta>
            <Phone size={12} style={{ display: 'inline', marginRight: 4 }} />
            {card.phone}
          </Meta>
          <Meta>
            <DollarSign size={12} style={{ display: 'inline', marginRight: 4 }} />
            {card.budget}
          </Meta>
          <Meta>
            <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
            {card.area}
          </Meta>
          <Meta>
            <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
            {card.lastContact}
          </Meta>
          {i === 0 && (
            <ActionRow>
              <ActionBtn $variant="dismiss" onClick={() => handleSwipeLeft(card.id)}>
                Skip
              </ActionBtn>
              <ActionBtn $variant="contact" onClick={() => handleSwipeRight(card.id)}>
                <MessageCircle size={14} style={{ display: 'inline', marginRight: 4 }} />
                Contact
              </ActionBtn>
            </ActionRow>
          )}
        </Card>
      ))}
    </StackWrapper>
  );
};

export default MobileLeadCardStack;
