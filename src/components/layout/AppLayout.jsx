import React from 'react';
import TopNavBar from './TopNavBar';
import './AppLayout.css';

export default function AppLayout({ children, showNav = true }) {
  return (
    <div className="app-layout">
      {showNav && <TopNavBar />}
      <main className={`app-main ${showNav ? 'with-nav' : ''}`}>
        {children}
      </main>
    </div>
  );
}
