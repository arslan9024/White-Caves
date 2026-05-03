import React from 'react';
import { Smartphone, Download, Apple } from 'lucide-react';
import './MobileAppBanner.css';

export default function MobileAppBanner() {
  return (
    <section className="mobile-app-section">
      <div className="mobile-app-container">
        <div className="app-content">
          <div className="app-text">
            <h2 className="app-title">Download White Caves App</h2>
            <p className="app-subtitle">
              Search properties, schedule viewings, and manage your real estate journey on the go
            </p>
            <div className="app-buttons">
              <button
                className="app-store-btn"
                aria-label="Download White Caves on the App Store (coming soon)"
                disabled
              >
                <Apple size={24} aria-hidden="true" />
                <div className="btn-text">
                  <span className="btn-label">Download on the</span>
                  <span className="btn-store">App Store</span>
                </div>
              </button>
              <button
                className="play-store-btn"
                aria-label="Get White Caves on Google Play (coming soon)"
                disabled
              >
                <Download size={24} aria-hidden="true" />
                <div className="btn-text">
                  <span className="btn-label">Get it on</span>
                  <span className="btn-store">Google Play</span>
                </div>
              </button>
            </div>
            <p className="coming-soon">Coming Soon</p>
          </div>
          <div className="app-mockup">
            <div className="phone-frame">
              <Smartphone size={180} className="phone-icon" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
