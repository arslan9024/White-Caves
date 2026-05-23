import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AuroraTechnicalDashboard from '../AuroraTechnicalDashboard';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);

describe('AuroraTechnicalDashboard', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      aurora: {
        monitoring: {
          enabled: true,
          vercel: { buildTime: 8.27, bundleSize: 2792.34, deploymentSuccess: 100 },
          mongodb: { queryLatency: 45, connectionPool: 7, writeLatency: 38 },
          alerts: []
        }
      }
    });
  });

  test('renders Aurora Technical Dashboard header', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Aurora's Technical Monitoring Dashboard/i)).toBeInTheDocument();
  });

  test('displays system health status section', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/System Health Status/i)).toBeInTheDocument();
  });

  test('shows uptime metric', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText('Uptime')).toBeInTheDocument();
    expect(screen.getByText('99.98%')).toBeInTheDocument();
  });

  test('displays services health count', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Services Healthy/i)).toBeInTheDocument();
    expect(screen.getByText('10/11')).toBeInTheDocument();
  });

  test('shows active alerts count', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Active Alerts/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('displays average API latency metric', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Avg API Latency/i)).toBeInTheDocument();
    expect(screen.getByText('460ms')).toBeInTheDocument();
  });

  test('renders latency trend chart', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/API Latency Trend/i)).toBeInTheDocument();
  });

  test('renders error rate trend chart', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Error Rate Trend/i)).toBeInTheDocument();
  });

  test('renders concurrent users chart', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Concurrent Users vs Capacity/i)).toBeInTheDocument();
  });

  test('renders service health distribution chart', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Service Health Distribution/i)).toBeInTheDocument();
  });

  test('has navigation buttons for tabs', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByRole('button', { name: /Health Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Services/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /API Endpoints/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Alerts/i })).toBeInTheDocument();
  });

  test('switches to services tab on click', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const servicesTab = screen.getByRole('button', { name: /Services/i });
    fireEvent.click(servicesTab);
    
    expect(servicesTab).toHaveClass('active');
  });

  test('displays services table when in services tab', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const servicesTab = screen.getByRole('button', { name: /Services/i });
    fireEvent.click(servicesTab);
    
    expect(screen.getByText(/Service Health Details/i)).toBeInTheDocument();
  });

  test('switches to API endpoints tab', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const apisTab = screen.getByRole('button', { name: /API Endpoints/i });
    fireEvent.click(apisTab);
    
    expect(apisTab).toHaveClass('active');
  });

  test('displays API endpoints table', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const apisTab = screen.getByRole('button', { name: /API Endpoints/i });
    fireEvent.click(apisTab);
    
    expect(screen.getByText(/API Endpoint Performance/i)).toBeInTheDocument();
  });

  test('switches to alerts tab', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const alertsTab = screen.getByRole('button', { name: /Alerts/i });
    fireEvent.click(alertsTab);
    
    expect(alertsTab).toHaveClass('active');
  });

  test('shows refresh interval selector', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const refreshSelect = screen.getByDisplayValue('Refresh: 10s');
    expect(refreshSelect).toBeInTheDocument();
  });

  test('changes refresh interval on selection', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const refreshSelect = screen.getByDisplayValue('Refresh: 10s');
    fireEvent.change(refreshSelect, { target: { value: '5000' } });
    
    expect(refreshSelect.value).toBe('5000');
  });

  test('displays last update time', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();
  });

  test('shows health status indicator', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    // Should display health status indicators
    const healthElements = document.querySelectorAll('[class*="health"]');
    expect(healthElements.length).toBeGreaterThan(0);
  });

  test('renders footer with description', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Aurora's Technical Authority/i)).toBeInTheDocument();
  });

  test('displays service status badges', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const servicesTab = screen.getByRole('button', { name: /Services/i });
    fireEvent.click(servicesTab);
    
    const statusBadges = screen.getAllByText(/✓ Healthy|⚠ Degraded/i);
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  test('shows latency values in tables', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const servicesTab = screen.getByRole('button', { name: /Services/i });
    fireEvent.click(servicesTab);
    
    const latencyElements = screen.getAllByText(/ms/);
    expect(latencyElements.length).toBeGreaterThan(0);
  });

  test('displays error rate percentages', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const servicesTab = screen.getByRole('button', { name: /Services/i });
    fireEvent.click(servicesTab);
    
    const errorElements = screen.getAllByText(/%/);
    expect(errorElements.length).toBeGreaterThan(0);
  });

  test('shows API throughput in requests per second', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const apisTab = screen.getByRole('button', { name: /API Endpoints/i });
    fireEvent.click(apisTab);
    
    // Throughput values like "450", "380", etc
    expect(screen.getByText('450')).toBeInTheDocument();
  });

  test('renders action buttons in services table', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const servicesTab = screen.getByRole('button', { name: /Services/i });
    fireEvent.click(servicesTab);
    
    const detailsButtons = screen.getAllByRole('button', { name: /Details/i });
    expect(detailsButtons.length).toBeGreaterThan(0);
  });

  test('shows API performance status badges', () => {
    render(
      <Provider store={store}>
        <AuroraTechnicalDashboard />
      </Provider>
    );
    
    const apisTab = screen.getByRole('button', { name: /API Endpoints/i });
    fireEvent.click(apisTab);
    
    const performanceBadges = screen.getAllByText(/✓ Fast|⚠ Slow/i);
    expect(performanceBadges.length).toBeGreaterThan(0);
  });
});
