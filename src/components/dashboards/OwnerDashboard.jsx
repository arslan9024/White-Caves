import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Home, TrendingUp, DollarSign, Users, Calendar, AlertCircle,
  Filter, Download, Plus, Settings, Phone, MessageSquare
} from 'lucide-react';
import PlanManager from '../plans/PlanManager';
import './OwnerDashboard.css';

/**
 * Owner Dashboard - For Mary (Property Owner/Manager)
 * 
 * Key Responsibilities:
 * - Property portfolio management
 * - Tenant management and communication
 * - Lease tracking and renewals
 * - Maintenance request handling
 * - Financial tracking (rent, expenses, ROI)
 * - Property analytics and occupancy
 */

export default function OwnerDashboard({ user }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [timeframe, setTimeframe] = useState('month');

  // Mock data
  const ownerMetrics = {
    totalProperties: 12,
    occupiedUnits: 10,
    occupancyRate: '83%',
    totalMonthlyRent: 'AED 285,000',
    totalExpenses: 'AED 48,500',
    netIncome: 'AED 236,500',
    yearlyROI: '12.5%'
  };

  const properties = [
    {
      id: 1,
      name: 'Damac Hills 2 - Villa 2456',
      type: 'Villa',
      location: 'Dubai Hills Estate',
      units: 1,
      occupied: 1,
      monthlyRent: 'AED 85,000',
      annualRent: 'AED 1,020,000',
      tenant: 'Ahmed Hassan',
      leaseExpiry: '2025-06-15',
      status: 'occupied',
      image: '🏠'
    },
    {
      id: 2,
      name: 'Damac Hills 2 - Apartment 5678',
      type: 'Apartment',
      location: 'Dubai Hills Estate',
      units: 2,
      occupied: 2,
      monthlyRent: 'AED 95,000',
      annualRent: 'AED 1,140,000',
      tenant: 'Fatima Al-Mansouri, Sarah Williams',
      leaseExpiry: '2024-12-31',
      status: 'occupied',
      image: '🏢'
    },
    {
      id: 3,
      name: 'Downtown Dubai - Studio Apt',
      type: 'Studio',
      location: 'Downtown Dubai',
      units: 1,
      occupied: 0,
      monthlyRent: 'AED 45,000',
      annualRent: 'AED 540,000',
      tenant: 'Vacant',
      leaseExpiry: null,
      status: 'vacant',
      image: '🏘️'
    },
    {
      id: 4,
      name: 'JBR - 3BR Apartment',
      type: 'Apartment',
      location: 'Jumeirah Beach Residence',
      units: 1,
      occupied: 1,
      monthlyRent: 'AED 65,000',
      annualRent: 'AED 780,000',
      tenant: 'Mohammed Khan',
      leaseExpiry: '2025-03-20',
      status: 'occupied',
      image: '🏢'
    }
  ];

  const monthlyIncomeData = [
    { month: 'Jan', rent: 285000, expenses: 48500, net: 236500 },
    { month: 'Feb', rent: 285000, expenses: 52300, net: 232700 },
    { month: 'Mar', rent: 285000, expenses: 45800, net: 239200 },
    { month: 'Apr', rent: 280000, expenses: 51200, net: 228800 },
    { month: 'May', rent: 290000, expenses: 46100, net: 243900 },
    { month: 'Jun', rent: 285000, expenses: 49500, net: 235500 }
  ];

  const tenants = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      property: 'Damac Hills 2 - Villa 2456',
      phone: '+971501234567',
      email: 'ahmed.h@example.com',
      leaseStart: '2023-06-15',
      leaseEnd: '2025-06-15',
      monthlyRent: 'AED 85,000',
      status: 'active',
      paymentStatus: 'on-time'
    },
    {
      id: 2,
      name: 'Fatima Al-Mansouri',
      property: 'Damac Hills 2 - Apartment 5678',
      phone: '+971501234568',
      email: 'fatima.m@example.com',
      leaseStart: '2022-12-31',
      leaseEnd: '2024-12-31',
      monthlyRent: 'AED 48,000',
      status: 'active',
      paymentStatus: 'overdue'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      property: 'Damac Hills 2 - Apartment 5678',
      phone: '+971501234570',
      email: 'sarah.w@example.com',
      leaseStart: '2023-01-15',
      leaseEnd: '2025-01-15',
      monthlyRent: 'AED 47,000',
      status: 'active',
      paymentStatus: 'on-time'
    },
    {
      id: 4,
      name: 'Mohammed Khan',
      property: 'JBR - 3BR Apartment',
      phone: '+971501234569',
      email: 'mohammed.k@example.com',
      leaseStart: '2023-03-20',
      leaseEnd: '2025-03-20',
      monthlyRent: 'AED 65,000',
      status: 'active',
      paymentStatus: 'on-time'
    }
  ];

  const maintenanceRequests = [
    {
      id: 1,
      property: 'Damac Hills 2 - Villa 2456',
      type: 'AC Repair',
      description: 'Main bedroom AC not cooling',
      reportedBy: 'Ahmed Hassan',
      date: '2024-01-15',
      priority: 'high',
      status: 'in-progress',
      estimatedCost: 'AED 1,200'
    },
    {
      id: 2,
      property: 'Damac Hills 2 - Apartment 5678',
      type: 'Plumbing',
      description: 'Kitchen sink leaking',
      reportedBy: 'Fatima Al-Mansouri',
      date: '2024-01-14',
      priority: 'medium',
      status: 'pending',
      estimatedCost: 'AED 800'
    },
    {
      id: 3,
      property: 'JBR - 3BR Apartment',
      type: 'Electrical',
      description: 'Kitchen light flickering',
      reportedBy: 'Mohammed Khan',
      date: '2024-01-13',
      priority: 'low',
      status: 'completed',
      estimatedCost: 'AED 500'
    }
  ];

  const expenses = [
    { category: 'Maintenance', amount: 15200, percentage: 31 },
    { category: 'Management Fees', amount: 12000, percentage: 25 },
    { category: 'Utilities', amount: 10300, percentage: 21 },
    { category: 'Insurance', amount: 6500, percentage: 13 },
    { category: 'Other', amount: 4500, percentage: 10 }
  ];

  const rentPaymentStatus = [
    { name: 'On Time', value: 3, color: '#10b981' },
    { name: 'Overdue', value: 1, color: '#ef4444' },
    { name: 'Pending', value: 0, color: '#f59e0b' }
  ];

  const upcomingLeaseRenewals = [
    { property: 'Damac Hills 2 - Apartment 5678', tenant: 'Fatima Al-Mansouri', daysUntilExpiry: 320, expiryDate: '2024-12-31' },
    { property: 'Damac Hills 2 - Villa 2456', tenant: 'Ahmed Hassan', daysUntilExpiry: 526, expiryDate: '2025-06-15' },
    { property: 'JBR - 3BR Apartment', tenant: 'Mohammed Khan', daysUntilExpiry: 440, expiryDate: '2025-03-20' }
  ];

  const getPropertyStatus = (status) => {
    const colors = {
      occupied: '#10b981',
      vacant: '#f59e0b',
      maintenance: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="owner-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Property Management Dashboard</h1>
          <p>Property Owner - Mary | {ownerMetrics.totalProperties} Properties | {ownerMetrics.occupancyRate} Occupied</p>
        </div>
        <div className="header-actions">
          <button className="btn-action btn-primary">
            <Plus size={18} /> Add Property
          </button>
          <button className="btn-action btn-secondary">
            <Download size={18} /> Reports
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="kpi-section">
        <div className="kpi-card property-count">
          <div className="kpi-label">🏠 Total Properties</div>
          <div className="kpi-value">{ownerMetrics.totalProperties}</div>
          <div className="kpi-sublabel">{ownerMetrics.occupiedUnits} units occupied</div>
        </div>
        <div className="kpi-card occupancy">
          <div className="kpi-label">📊 Occupancy Rate</div>
          <div className="kpi-value">{ownerMetrics.occupancyRate}</div>
          <div className="kpi-sublabel">Above market average</div>
        </div>
        <div className="kpi-card monthly-rent">
          <div className="kpi-label">💰 Monthly Rent</div>
          <div className="kpi-value">{ownerMetrics.totalMonthlyRent}</div>
          <div className="kpi-sublabel">Average per unit</div>
        </div>
        <div className="kpi-card expenses">
          <div className="kpi-label">📉 Total Expenses</div>
          <div className="kpi-value">{ownerMetrics.totalExpenses}</div>
          <div className="kpi-sublabel">This month</div>
        </div>
        <div className="kpi-card net-income">
          <div className="kpi-label">✅ Net Income</div>
          <div className="kpi-value">{ownerMetrics.netIncome}</div>
          <div className="kpi-sublabel">Monthly profit</div>
        </div>
        <div className="kpi-card roi">
          <div className="kpi-label">📈 Yearly ROI</div>
          <div className="kpi-value">{ownerMetrics.yearlyROI}</div>
          <div className="kpi-sublabel">Return on investment</div>
        </div>
      </section>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {['overview', 'properties', 'tenants', 'maintenance', 'financials', 'plans'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'plans' ? '📋 Plans' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content overview-tab">
          <div className="grid-2col">
            {/* Monthly Income Chart */}
            <div className="card">
              <h3>Monthly Income & Expenses</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `AED ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="rent" fill="#10b981" name="Rent Income" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  <Bar dataKey="net" fill="#8B5CF6" name="Net Income" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown */}
            <div className="card">
              <h3>Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={expenses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {expenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#8B5CF6'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `AED ${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Lease Renewals */}
          <div className="card">
            <h3>Upcoming Lease Renewals</h3>
            <div className="renewals-list">
              {upcomingLeaseRenewals.map((renewal, idx) => (
                <div key={idx} className="renewal-item">
                  <div className="renewal-info">
                    <h4>{renewal.property}</h4>
                    <p>{renewal.tenant}</p>
                  </div>
                  <div className="renewal-timeline">
                    <div className="days-counter">
                      <span className="days-label">Days Until Expiry</span>
                      <span className="days-value">{renewal.daysUntilExpiry}</span>
                    </div>
                    <div className="expiry-date">{renewal.expiryDate}</div>
                  </div>
                  <button className="renewal-action">Renew</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div className="tab-content properties-tab">
          <div className="properties-list">
            {properties.map(property => (
              <div key={property.id} className={`property-card status-${property.status}`}>
                <div className="property-image">{property.image}</div>
                <div className="property-info">
                  <h4>{property.name}</h4>
                  <p className="property-location">{property.location}</p>
                  <div className="property-details">
                    <span className="detail">📍 {property.type}</span>
                    <span className="detail">🛏️ {property.units} Unit(s)</span>
                    <span className="detail">👥 {property.occupied}/{property.units} Occupied</span>
                  </div>
                </div>
                <div className="property-financial">
                  <div className="financial-item">
                    <span className="label">Monthly</span>
                    <span className="value">{property.monthlyRent}</span>
                  </div>
                  <div className="financial-item">
                    <span className="label">Annual</span>
                    <span className="value">{property.annualRent}</span>
                  </div>
                </div>
                <div className="property-status">
                  <span className={`status-badge status-${property.status}`}>{property.status}</span>
                  {property.leaseExpiry && (
                    <span className="lease-expiry">Expires: {property.leaseExpiry}</span>
                  )}
                </div>
                <div className="property-actions">
                  <button className="action-btn">Manage</button>
                  <button className="action-btn">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tenants Tab */}
      {activeTab === 'tenants' && (
        <div className="tab-content tenants-tab">
          <div className="tenants-list">
            {tenants.map(tenant => (
              <div key={tenant.id} className={`tenant-card payment-${tenant.paymentStatus}`}>
                <div className="tenant-header">
                  <h4>{tenant.name}</h4>
                  <span className={`payment-badge payment-${tenant.paymentStatus}`}>
                    {tenant.paymentStatus === 'on-time' ? '✓ On Time' : '⚠ Overdue'}
                  </span>
                </div>
                <div className="tenant-info">
                  <p className="property-name">{tenant.property}</p>
                  <div className="tenant-contact">
                    <a href={`tel:${tenant.phone}`} className="contact-link">{tenant.phone}</a>
                    <a href={`mailto:${tenant.email}`} className="contact-link">{tenant.email}</a>
                  </div>
                </div>
                <div className="tenant-lease">
                  <div className="lease-item">
                    <span className="label">Monthly Rent</span>
                    <span className="value">{tenant.monthlyRent}</span>
                  </div>
                  <div className="lease-item">
                    <span className="label">Lease Ends</span>
                    <span className="value">{tenant.leaseEnd}</span>
                  </div>
                </div>
                <div className="tenant-actions">
                  <button className="action-btn" title="Call Tenant">
                    <Phone size={16} />
                  </button>
                  <button className="action-btn" title="Message">
                    <MessageSquare size={16} />
                  </button>
                  <button className="action-btn" title="View Details">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="tab-content maintenance-tab">
          <div className="maintenance-list">
            {maintenanceRequests.map(request => (
              <div key={request.id} className={`maintenance-item priority-${request.priority}`}>
                <div className="request-header">
                  <h4>{request.type}</h4>
                  <span className={`priority-badge priority-${request.priority}`}>{request.priority}</span>
                </div>
                <p className="request-description">{request.description}</p>
                <div className="request-details">
                  <span className="detail">📍 {request.property}</span>
                  <span className="detail">👤 {request.reportedBy}</span>
                  <span className="detail">📅 {request.date}</span>
                  <span className="detail">💰 {request.estimatedCost}</span>
                </div>
                <div className="request-footer">
                  <span className={`status-badge status-${request.status}`}>{request.status}</span>
                  <div className="request-actions">
                    <button className="action-btn">Contact Vendor</button>
                    <button className="action-btn">Update</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financials Tab */}
      {activeTab === 'financials' && (
        <div className="tab-content financials-tab">
          <div className="grid-2col">
            <div className="card">
              <h3>Rent Payment Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={rentPaymentStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rentPaymentStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3>Financial Summary</h3>
              <div className="financial-summary">
                <div className="summary-item">
                  <span className="label">Total Annual Income</span>
                  <span className="value highlight">AED 3,420,000</span>
                </div>
                <div className="summary-item">
                  <span className="label">Annual Expenses</span>
                  <span className="value">AED 582,000</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item">
                  <span className="label">Net Annual Income</span>
                  <span className="value large">AED 2,838,000</span>
                </div>
                <div className="summary-item">
                  <span className="label">Estimated ROI</span>
                  <span className="value large success">+12.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="tab-content plans-tab">
          <PlanManager />
        </div>
      )}
    </div>
  );
}
