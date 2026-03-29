import React, { FC, useState } from 'react';
import { Search, Mail, Lock, Heart, Star, Building2, Users, Wallet, TrendingUp } from 'lucide-react';
import './DesignSystemTest.css';

interface DesignSystemTestProps {}

const DesignSystemTest: FC<DesignSystemTestProps> = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleLoadingClick = (): void => {
    setLoading(true);
    timerRef.current = setTimeout(() => setLoading(false), 2000);
  };

  // Gate this page to development mode only
  if (!import.meta.env.DEV) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Design System Test</h2>
        <p>This page is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="design-system-test">
      <header className="dst-header">
        <h1>White Caves Design System</h1>
        <p>Component Library & Style Guide</p>
      </header>

      <section className="dst-section">
        <h2>Buttons</h2>
        <div className="dst-group">
          <h3>Variants</h3>
          <div className="dst-row">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-outline">Outline</button>
            <button className="btn btn-ghost">Ghost</button>
            <button className="btn btn-danger">Danger</button>
            <button className="btn btn-success">Success</button>
          </div>
        </div>

        <div className="dst-group">
          <h3>Sizes</h3>
          <div className="dst-row">
            <button className="btn btn-xs">Extra Small</button>
            <button className="btn btn-sm">Small</button>
            <button className="btn btn-md">Medium</button>
            <button className="btn btn-lg">Large</button>
          </div>
        </div>

        <div className="dst-group">
          <h3>States & Features</h3>
          <div className="dst-row">
            <button className="btn" disabled={loading} onClick={handleLoadingClick}>
              {loading ? 'Loading...' : 'Click to Load'}
            </button>
            <button className="btn" disabled>Disabled</button>
            <button className="btn btn-gradient">Gradient</button>
          </div>
        </div>
      </section>

      <section className="dst-section">
        <h2>Inputs</h2>
        <div className="dst-group">
          <div className="dst-grid-2">
            <div className="input-wrapper">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <small>We'll never share your email</small>
            </div>
            <div className="input-wrapper">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystemTest;
