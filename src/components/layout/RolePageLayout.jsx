import React from 'react';

export default function RolePageLayout({ title, subtitle, actions, children }) {
  return (
    <section className="role-page-layout" style={{ display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
        <div>
          {title ? <h1 style={{ margin: 0 }}>{title}</h1> : null}
          {subtitle ? <p style={{ margin: '4px 0 0', opacity: 0.8 }}>{subtitle}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      <div>{children}</div>
    </section>
  );
}
