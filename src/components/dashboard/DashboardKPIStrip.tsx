import React, { FC } from 'react';

interface DashboardKPICard {
  id: string;
  icon: string;
  label: string;
  value: string;
  subtext: string;
  trend: string;
  positive: boolean;
}

interface DashboardKPIStripProps {
  cards: DashboardKPICard[];
}

const DashboardKPIStrip: FC<DashboardKPIStripProps> = ({ cards }) => {
  if (!cards.length) return null;

  return (
    <section className="dashboard-kpi-strip" aria-label="Dashboard highlights">
      {cards.map(card => (
        <article key={card.id} className="dashboard-kpi-card">
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
      ))}
    </section>
  );
};

export default DashboardKPIStrip;
