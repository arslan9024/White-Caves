import React from 'react';
import './LeadCard.css';

export function LeadScoreBadge({ score, size = 'default' }) {
  const getScoreLevel = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  return (
    <span className={`lead-score-badge ${getScoreLevel(score)} ${size}`}>
      {score}
    </span>
  );
}

export function LeadStatusBadge({ status }) {
  const statusLower = status.toLowerCase();
  return (
    <span className={`lead-status-badge ${statusLower}`}>
      {status}
    </span>
  );
}

export default function LeadCard({
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
  className = ''
}) {
  return (
    <div className={`lead-card-reusable ${className}`}>
      <div className="lead-card-header">
        <div className="lead-avatar">
          {avatar ? (
            <img src={avatar} alt={name} />
          ) : (
            <span>{name?.charAt(0) || '?'}</span>
          )}
        </div>
        <div className="lead-header-info">
          <span className="lead-name">{name}</span>
          <LeadStatusBadge status={status} />
        </div>
        {score !== undefined && <LeadScoreBadge score={score} />}
      </div>
      
      <div className="lead-card-body">
        {requirement && <p className="lead-detail">Looking for: {requirement}</p>}
        {budget && <p className="lead-detail">Budget: {budget}</p>}
        {source && <p className="lead-detail">Source: {source}</p>}
        {lastContact && <p className="lead-detail">Last contact: {lastContact}</p>}
      </div>
      
      {(onView || onContact) && (
        <div className="lead-card-actions">
          {onView && (
            <button className="btn btn-sm btn-secondary" onClick={onView}>
              View
            </button>
          )}
          {onContact && (
            <button className="btn btn-sm btn-primary" onClick={onContact}>
              Contact
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function LeadListItem({
  name,
  requirement,
  budget,
  status,
  score,
  onClick,
  className = ''
}) {
  return (
    <div 
      className={`lead-list-item ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {score !== undefined && (
        <div className="lead-score-wrapper">
          <LeadScoreBadge score={score} />
        </div>
      )}
      <div className="lead-info">
        <span className="lead-name">{name}</span>
        <span className="lead-details">{requirement} · {budget}</span>
      </div>
      <LeadStatusBadge status={status} />
    </div>
  );
}
