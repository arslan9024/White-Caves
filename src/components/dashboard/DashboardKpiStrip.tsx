import React, { FC } from 'react';

export interface KpiCardData {
  id: string;
  icon: string;
  label: string;
  value: string;
  subtext: string;
  trend: string;
  positive: boolean;
}

const DashboardKpiCard: FC<{ card: KpiCardData }> = ({ card }) => (
  <article className="dashboard-kpi-card">
    <div className="dashboard-kpi-card__icon" aria-hidden="true">
      {card.icon}
    </div>
    <div className="dashboard-kpi-card__body">
      <p>{card.label}</p>
      <strong>{card.value}</strong>
      <span>{card.subtext}</span>
    </div>
    <div className={`dashboard-kpi-card__trend ${card.positive ? 'positive' : 'negative'}`}>
      {card.trend}
    </div>
  </article>
);

interface DashboardKpiStripProps {
  cards: KpiCardData[];
}

const DashboardKpiStrip: FC<DashboardKpiStripProps> = ({ cards }) => (
  <section className="dashboard-kpi-strip" aria-label="Dashboard highlights">
    {cards.map(card => (
      <DashboardKpiCard key={card.id} card={card} />
    ))}
  </section>
);

export default DashboardKpiStrip;
