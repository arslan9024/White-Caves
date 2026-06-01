import React from 'react';
import { Link } from 'react-router-dom';

export function StatCardGrid({ columns = 4, children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: '1rem',
        marginBottom: '1.25rem',
      }}
    >
      {children}
    </div>
  );
}

export function StatCard({ icon, value, label, change, positive = true }) {
  return (
    <div
      style={{
        background: 'var(--bg-card, #fff)',
        border: '1px solid var(--border-color, #e5e7eb)',
        borderRadius: '12px',
        padding: '1rem',
      }}
    >
      <div style={{ fontSize: '1.1rem' }}>{icon}</div>
      <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.4rem' }}>{value}</div>
      <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>{label}</div>
      {change ? (
        <div style={{ fontSize: '0.8rem', color: positive ? '#059669' : '#6b7280', marginTop: '0.4rem' }}>
          {change}
        </div>
      ) : null}
    </div>
  );
}

export function TabbedPanel({ tabs = [], activeTab, onTabChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0', flexWrap: 'wrap' }}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange?.(tab.id)}
            style={{
              borderRadius: '999px',
              border: isActive ? '1px solid #2563eb' : '1px solid #d1d5db',
              background: isActive ? '#eff6ff' : '#fff',
              color: isActive ? '#1d4ed8' : '#374151',
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
            }}
          >
            <span style={{ marginRight: '0.35rem' }}>{tab.icon}</span>
            {tab.label}
            {typeof tab.badge !== 'undefined' ? (
              <span style={{ marginLeft: '0.4rem', opacity: 0.75 }}>({tab.badge})</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function DataCardGrid({ columns = 2, children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: '1rem',
      }}
    >
      {children}
    </div>
  );
}

export function DataCard({ title, viewAllLink, headerActions, fullWidth = false, children }) {
  return (
    <section
      style={{
        gridColumn: fullWidth ? '1 / -1' : undefined,
        background: 'var(--bg-card, #fff)',
        border: '1px solid var(--border-color, #e5e7eb)',
        borderRadius: '12px',
        padding: '1rem',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {headerActions}
          {viewAllLink ? <Link to={viewAllLink}>View all</Link> : null}
        </div>
      </header>
      {children}
    </section>
  );
}

export function DataList({ children }) {
  return <div style={{ display: 'grid', gap: '0.6rem' }}>{children}</div>;
}

export function DataListItem({
  icon,
  title,
  subtitle,
  status,
  statusColor,
  meta,
  badge,
  badgeColor,
  actions,
}) {
  return (
    <article
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.75rem',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '0.7rem 0.75rem',
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>{icon ? `${icon} ` : ''}{title}</div>
        {subtitle ? <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{subtitle}</div> : null}
        {meta ? <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{meta}</div> : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {status ? (
          <span style={{ color: statusColor ? `rgb(${statusColor})` : '#6b7280', fontSize: '0.82rem' }}>
            {status}
          </span>
        ) : null}
        {badge ? (
          <span style={{ color: badgeColor ? `rgb(${badgeColor})` : '#6b7280', fontSize: '0.82rem' }}>
            {badge}
          </span>
        ) : null}
        {actions}
      </div>
    </article>
  );
}

export function QuickLinks({ title, links = [], columns = 4 }) {
  return (
    <section style={{ marginBottom: '1rem' }}>
      {title ? <h3 style={{ margin: '0 0 0.5rem 0' }}>{title}</h3> : null}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: '0.75rem',
        }}
      >
        {links.map((link, idx) => (
          <Link
            key={link.path || idx}
            to={link.path || '#'}
            style={{
              display: 'block',
              textDecoration: 'none',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '0.75rem',
              color: 'inherit',
              background: '#fff',
            }}
          >
            <div style={{ fontWeight: 600 }}>{link.icon ? `${link.icon} ` : ''}{link.title}</div>
            {link.description ? <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{link.description}</div> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ActionButton({ icon, label, to, variant = 'primary', size = 'medium', onClick, type = 'button' }) {
  const style = {
    border: variant === 'primary' ? '1px solid #2563eb' : '1px solid #d1d5db',
    background: variant === 'primary' ? '#2563eb' : '#fff',
    color: variant === 'primary' ? '#fff' : '#374151',
    borderRadius: '8px',
    padding: size === 'small' ? '0.35rem 0.6rem' : '0.5rem 0.75rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: size === 'small' ? '0.85rem' : '0.9rem',
  };

  if (to) {
    return (
      <Link to={to} style={style}>
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <button type={type} style={style} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

export function LeadListItem({ name, requirement, budget, status, score, onClick }) {
  return (
    <DataListItem
      icon="👤"
      title={name}
      subtitle={`${requirement} · ${budget}`}
      status={status}
      meta={typeof score === 'number' ? `Score: ${score}` : undefined}
      actions={
        onClick ? (
          <button type="button" onClick={onClick} style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.2rem 0.45rem' }}>
            Open
          </button>
        ) : null
      }
    />
  );
}

export function PropertyListItem({ title, location, price, views, inquiries, daysListed }) {
  return (
    <DataListItem
      icon="🏠"
      title={title}
      subtitle={`${location} · ${price}`}
      meta={`${views ?? 0} views · ${inquiries ?? 0} inquiries · ${daysListed ?? 0} days listed`}
    />
  );
}

export function PipelineBoard({ stages = [] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '0.6rem',
      }}
    >
      {stages.map((stage, index) => (
        <div
          key={`${stage.name || 'stage'}-${index}`}
          style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.65rem' }}
        >
          <div style={{ fontWeight: 600 }}>{stage.name}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{stage.count ?? 0} deals</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{stage.value ?? ''}</div>
        </div>
      ))}
    </div>
  );
}

export function DealProgressBar({ progress = 0, stage }) {
  const clamped = Math.max(0, Math.min(100, Number(progress) || 0));
  return (
    <div style={{ minWidth: '180px' }}>
      {stage ? <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>{stage}</div> : null}
      <div style={{ width: '100%', height: '8px', borderRadius: '999px', background: '#e5e7eb' }}>
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            borderRadius: '999px',
            background: clamped >= 70 ? '#10b981' : clamped >= 40 ? '#f59e0b' : '#ef4444',
          }}
        />
      </div>
      <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.2rem' }}>{clamped}%</div>
    </div>
  );
}
