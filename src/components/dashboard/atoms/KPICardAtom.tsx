import React, { FC } from 'react';

export interface KPICardProps {
  id?: string;
  icon: string;
  label: React.ReactNode;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  trend?: string;
  positive?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
}

export const KPICardAtom: FC<KPICardProps> = ({
  icon,
  label,
  value,
  subtext,
  trend,
  positive,
  onClick,
  isLoading,
}) => (
  <button className="kpi-card" onClick={onClick} disabled={isLoading}>
    <div className="kpi-card__icon" aria-hidden="true">
      {icon}
    </div>
    <div className="kpi-card__content">
      <h3 className="kpi-card__label">{label}</h3>
      <div className="kpi-card__value">{isLoading ? '...' : value}</div>
      {subtext && <p className="kpi-card__subtext">{subtext}</p>}
    </div>
    {trend && (
      <div
        className={`kpi-card__trend ${positive ? 'kpi-card__trend--positive' : 'kpi-card__trend--negative'}`}
      >
        {trend}
      </div>
    )}
  </button>
);
