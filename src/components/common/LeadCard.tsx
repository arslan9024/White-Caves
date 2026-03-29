import React from 'react';
import {
  LeadScoreBadgeStyled,
  LeadStatusBadgeStyled,
  LeadCardContainer,
  LeadCardHeader,
  LeadAvatar,
  LeadHeaderInfo,
  LeadName,
  LeadCardBody,
  LeadDetail,
  LeadCardActions,
  LeadListItemContainer,
  LeadScoreWrapper,
  LeadInfo,
  LeadListName,
  LeadDetails,
} from './LeadCard/LeadCard.styles';

export function LeadScoreBadge({ score, size = 'default' }: { score: number; size?: 'default' | 'small' }) {
  const getScoreLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  return <LeadScoreBadgeStyled $level={getScoreLevel(score)} $size={size}>{score}</LeadScoreBadgeStyled>;
}

export function LeadStatusBadge({ status }: { status: string }) {
  return <LeadStatusBadgeStyled $statusType={status}>{status}</LeadStatusBadgeStyled>;
}

interface LeadCardProps {
  name: string;
  avatar?: string;
  requirement?: string;
  budget?: string;
  status: string;
  score?: number;
  source?: string;
  lastContact?: string;
  onView?: () => void;
  onContact?: () => void;
  className?: string;
}

function LeadCard({
  name,
  avatar,
  requirement,
  budget,
  status,
  score,
  source,
  lastContact,
  onView,
  onContact,
  className = '',
}: LeadCardProps) {
  return (
    <LeadCardContainer className={className}>
      <LeadCardHeader>
        <LeadAvatar>
          {avatar ? <img src={avatar} alt={name} loading="lazy" width={40} height={40} /> : <span>{name?.charAt(0) || '?'}</span>}
        </LeadAvatar>
        <LeadHeaderInfo>
          <LeadName>{name}</LeadName>
          <LeadStatusBadge status={status} />
        </LeadHeaderInfo>
        {score !== undefined && <LeadScoreBadge score={score} />}
      </LeadCardHeader>

      <LeadCardBody>
        {requirement && <LeadDetail>Looking for: {requirement}</LeadDetail>}
        {budget && <LeadDetail>Budget: {budget}</LeadDetail>}
        {source && <LeadDetail>Source: {source}</LeadDetail>}
        {lastContact && <LeadDetail>Last contact: {lastContact}</LeadDetail>}
      </LeadCardBody>

      {(onView || onContact) && (
        <LeadCardActions>
          {onView && (
            <button className="btn btn-sm btn-secondary" onClick={onView} type="button">
              View
            </button>
          )}
          {onContact && (
            <button className="btn btn-sm btn-primary" onClick={onContact} type="button">
              Contact
            </button>
          )}
        </LeadCardActions>
      )}
    </LeadCardContainer>
  );
}

interface LeadListItemProps {
  name: string;
  requirement?: string;
  budget?: string;
  status: string;
  score?: number;
  onClick?: () => void;
  className?: string;
}

export function LeadListItem({
  name,
  requirement,
  budget,
  status,
  score,
  onClick,
  className = '',
}: LeadListItemProps) {
  return (
    <LeadListItemContainer $clickable={!!onClick} onClick={onClick} className={className} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {score !== undefined && (
        <LeadScoreWrapper>
          <LeadScoreBadge score={score} size="small" />
        </LeadScoreWrapper>
      )}
      <LeadInfo>
        <LeadListName>{name}</LeadListName>
        <LeadDetails>
          {requirement} · {budget}
        </LeadDetails>
      </LeadInfo>
      <LeadStatusBadge status={status} />
    </LeadListItemContainer>
  );
}

export default React.memo(LeadCard);
