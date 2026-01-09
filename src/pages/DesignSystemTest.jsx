import React, { useState } from 'react';
import { Button, Input, Card, Badge } from '../components/ui';
import { Search, Mail, Lock, Heart, Star, Building2, Users, Wallet, TrendingUp } from 'lucide-react';
import './DesignSystemTest.css';

const DesignSystemTest = () => {
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

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
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
          </div>
        </div>

        <div className="dst-group">
          <h3>Sizes</h3>
          <div className="dst-row">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className="dst-group">
          <h3>States & Features</h3>
          <div className="dst-row">
            <Button loading={loading} onClick={handleLoadingClick}>
              {loading ? 'Loading...' : 'Click to Load'}
            </Button>
            <Button disabled>Disabled</Button>
            <Button gradient>Gradient</Button>
            <Button icon={<Heart size={16} />}>With Icon</Button>
            <Button icon={<Star size={16} />} iconPosition="right">Icon Right</Button>
          </div>
        </div>
      </section>

      <section className="dst-section">
        <h2>Inputs</h2>
        <div className="dst-group">
          <div className="dst-grid-2">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              icon={<Mail size={18} />}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="We'll never share your email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
          </div>
        </div>

        <div className="dst-group">
          <h3>Validation States</h3>
          <div className="dst-grid-3">
            <Input
              label="Success"
              placeholder="Valid input"
              value="john@example.com"
              success
              onChange={() => {}}
            />
            <Input
              label="Error"
              placeholder="Invalid input"
              value="invalid-email"
              error="Please enter a valid email address"
              onChange={() => {}}
            />
            <Input
              label="With Counter"
              placeholder="Type something..."
              maxLength={50}
              showCount
              clearable
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="dst-section">
        <h2>Cards</h2>
        <div className="dst-group">
          <h3>Stat Cards</h3>
          <div className="dst-grid-4">
            <Card.Stat
              title="Total Properties"
              value="9,378"
              change="+12%"
              changeType="positive"
              icon={<Building2 size={24} />}
              iconColor="#3B82F6"
            />
            <Card.Stat
              title="Active Leads"
              value="247"
              change="+28"
              changeType="positive"
              icon={<Users size={24} />}
              iconColor="#10B981"
            />
            <Card.Stat
              title="Revenue (AED)"
              value="2.4M"
              change="-5%"
              changeType="negative"
              icon={<Wallet size={24} />}
              iconColor="#F59E0B"
            />
            <Card.Stat
              title="Conversion Rate"
              value="18.5%"
              changeType="neutral"
              icon={<TrendingUp size={24} />}
              iconColor="#8B5CF6"
            />
          </div>
        </div>

        <div className="dst-group">
          <h3>Property Cards</h3>
          <div className="dst-grid-3">
            <Card.Property
              image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"
              title="Luxury Villa in Palm Jumeirah"
              price="AED 12,500,000"
              location="Palm Jumeirah, Dubai"
              bedrooms={5}
              bathrooms={4}
              area="4,500 sq.ft."
              status="forSale"
              statusLabel="For Sale"
            />
            <Card.Property
              image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400"
              title="Modern Apartment in Marina"
              price="AED 120,000/year"
              priceLabel="yearly"
              location="Dubai Marina"
              bedrooms={2}
              bathrooms={2}
              area="1,250 sq.ft."
              status="forRent"
              statusLabel="For Rent"
            />
            <Card.Property
              image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400"
              title="Townhouse in DAMAC Hills 2"
              price="AED 2,800,000"
              location="DAMAC Hills 2"
              bedrooms={4}
              bathrooms={3}
              area="2,800 sq.ft."
              status="reserved"
              statusLabel="Reserved"
            />
          </div>
        </div>

        <div className="dst-group">
          <h3>Agent Cards</h3>
          <div className="dst-grid-3">
            <Card.Agent
              name="Sara Ahmed"
              role="Senior Sales Agent"
              department="Sales"
              departmentColor="#8B5CF6"
              stats={[
                { value: '45', label: 'Deals' },
                { value: '4.9', label: 'Rating' },
                { value: '12M', label: 'Volume' }
              ]}
            />
            <Card.Agent
              name="Khalid Hassan"
              role="Leasing Manager"
              department="Operations"
              departmentColor="#3B82F6"
              stats={[
                { value: '128', label: 'Leases' },
                { value: '4.7', label: 'Rating' },
                { value: '8.5M', label: 'Volume' }
              ]}
            />
          </div>
        </div>
      </section>

      <section className="dst-section">
        <h2>Badges</h2>
        <div className="dst-group">
          <h3>Status Badges</h3>
          <div className="dst-row">
            <Badge.Status status="success">Success</Badge.Status>
            <Badge.Status status="warning">Warning</Badge.Status>
            <Badge.Status status="error">Error</Badge.Status>
            <Badge.Status status="info">Info</Badge.Status>
            <Badge.Status status="pending">Pending</Badge.Status>
            <Badge.Status status="active">Active</Badge.Status>
          </div>
        </div>

        <div className="dst-group">
          <h3>Property Status</h3>
          <div className="dst-row">
            <Badge.PropertyStatus status="forSale" />
            <Badge.PropertyStatus status="forRent" />
            <Badge.PropertyStatus status="sold" />
            <Badge.PropertyStatus status="reserved" />
            <Badge.PropertyStatus status="offPlan" />
            <Badge.PropertyStatus status="underOffer" />
          </div>
        </div>

        <div className="dst-group">
          <h3>Role Badges</h3>
          <div className="dst-row">
            <Badge.Role role="owner" />
            <Badge.Role role="admin" />
            <Badge.Role role="agent" />
            <Badge.Role role="tenant" />
            <Badge.Role role="buyer" />
            <Badge.Role role="landlord" />
          </div>
        </div>

        <div className="dst-group">
          <h3>Priority Badges</h3>
          <div className="dst-row">
            <Badge.Priority priority="critical" />
            <Badge.Priority priority="high" />
            <Badge.Priority priority="medium" />
            <Badge.Priority priority="low" />
          </div>
        </div>

        <div className="dst-group">
          <h3>Department Badges (AI Assistants)</h3>
          <div className="dst-row">
            <Badge.Department department="Communications" color="#25D366" />
            <Badge.Department department="Operations" color="#3B82F6" />
            <Badge.Department department="Sales" color="#8B5CF6" />
            <Badge.Department department="Finance" color="#F59E0B" />
            <Badge.Department department="Marketing" color="#EC4899" />
            <Badge.Department department="Technology" color="#0EA5E9" />
            <Badge.Department department="Intelligence" color="#0D9488" />
          </div>
        </div>
      </section>

      <section className="dst-section">
        <h2>Color Palette</h2>
        <div className="dst-group">
          <h3>Brand Colors</h3>
          <div className="dst-colors">
            <div className="dst-color" style={{ background: '#DC2626' }}>
              <span>Primary</span>
              <span>#DC2626</span>
            </div>
            <div className="dst-color" style={{ background: '#10B981' }}>
              <span>Success</span>
              <span>#10B981</span>
            </div>
            <div className="dst-color" style={{ background: '#F59E0B' }}>
              <span>Warning</span>
              <span>#F59E0B</span>
            </div>
            <div className="dst-color" style={{ background: '#EF4444' }}>
              <span>Error</span>
              <span>#EF4444</span>
            </div>
            <div className="dst-color" style={{ background: '#3B82F6' }}>
              <span>Info</span>
              <span>#3B82F6</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystemTest;
