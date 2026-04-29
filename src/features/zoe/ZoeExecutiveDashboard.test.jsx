import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ZoeExecutiveDashboard from '../ZoeExecutiveDashboard';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);

describe('ZoeExecutiveDashboard', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      wednesday: {
        business: {
          metrics: {
            leadConversion: 12,
            workflowCompletion: 96,
            errorRate: 0.3,
            apiResponseTime: 450,
            concurrentUsers: 65,
            contractExecution: 98,
            complianceScore: 100
          },
          requirementsMatrix: [
            { requirement: 'All 6 roles login', metric: 'Auth Success', target: '100%', actual: '100%', status: 'success' },
            { requirement: 'Lead pipeline', metric: 'Lead Conversion', target: '>10%', actual: '12%', status: 'success' },
            { requirement: 'Viewing system', metric: 'Booking Completion', target: '95%+', actual: '98%', status: 'success' },
            { requirement: 'Negotiations', metric: 'Offer Success', target: '75%+', actual: '85%', status: 'success' },
            { requirement: 'Document system', metric: 'Doc Availability', target: '100%', actual: '100%', status: 'success' },
            { requirement: 'Communication', metric: 'Message Delivery', target: '99%+', actual: '99.5%', status: 'success' },
            { requirement: 'Analytics', metric: 'Report Accuracy', target: '100%', actual: '100%', status: 'success' }
          ],
          approvedChanges: []
        },
        escalations: {
          active: []
        },
        timeline: {
          morning: { complete: true, tasks: [] },
          afternoon: { complete: false, tasks: [] },
          evening: { complete: false, tasks: [] }
        }
      }
    });
  });

  test('renders Zoe Executive Dashboard header', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Zoe's Executive Dashboard/i)).toBeInTheDocument();
  });

  test('displays business metrics grid with 8 cards', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    expect(screen.getByText('Lead Conversion')).toBeInTheDocument();
    expect(screen.getByText('Workflow Completion')).toBeInTheDocument();
    expect(screen.getByText('Error Rate')).toBeInTheDocument();
    expect(screen.getByText('API Response Time')).toBeInTheDocument();
  });

  test('shows lead conversion metric value', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    const conversionValue = screen.getByText('12%');
    expect(conversionValue).toBeInTheDocument();
  });

  test('displays success status for metrics meeting targets', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    // Lead conversion 12% > 10% target should show success
    expect(screen.getAllByText(/✓ On Track|✓ Success/i).length).toBeGreaterThan(0);
  });

  test('renders requirements matrix table', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    expect(screen.getByText("Zoe's Approved Requirements")).toBeInTheDocument();
    expect(screen.getByText('Requirement')).toBeInTheDocument();
    expect(screen.getByText('Business Metric')).toBeInTheDocument();
  });

  test('displays all 7 requirements in matrix', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    expect(screen.getByText('All 6 roles login')).toBeInTheDocument();
    expect(screen.getByText('Lead pipeline')).toBeInTheDocument();
    expect(screen.getByText('Viewing system')).toBeInTheDocument();
    expect(screen.getByText('Negotiations')).toBeInTheDocument();
    expect(screen.getByText('Document system')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  test('shows timeline progress with 3 phases', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    expect(screen.getByText('Wednesday Timeline Progress')).toBeInTheDocument();
    expect(screen.getByText('Morning Session')).toBeInTheDocument();
    expect(screen.getByText('Afternoon Session')).toBeInTheDocument();
    expect(screen.getByText('Evening Session')).toBeInTheDocument();
  });

  test('displays correct phase completion status', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    // Morning complete, afternoon/evening pending
    const timelineTexts = screen.getAllByText(/✓ Complete|⏳ Pending/i);
    expect(timelineTexts.length).toBeGreaterThanOrEqual(3);
  });

  test('navigates to different tabs', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    const escalationsTab = screen.getByRole('button', { name: /🚨 Escalations/i });
    fireEvent.click(escalationsTab);
    
    expect(escalationsTab).toHaveClass('active');
  });

  test('shows escalations tab with correct count', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    const escalationsBtn = screen.getByRole('button', { name: /Escalations \(0\)/i });
    expect(escalationsBtn).toBeInTheDocument();
  });

  test('displays no escalations message when list is empty', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    const escalationsTab = screen.getByRole('button', { name: /🚨 Escalations/i });
    fireEvent.click(escalationsTab);
    
    expect(screen.getByText(/No active escalations/i)).toBeInTheDocument();
  });

  test('shows "On Track" for metrics above target', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    // Lead conversion 12% vs target >10%
    const statusElements = screen.getAllByText(/On Track|Success|Capacity/i);
    expect(statusElements.length).toBeGreaterThan(0);
  });

  test('shows warning status for metrics near limits', () => {
    const warningStore = configureStore([])({
      wednesday: {
        business: {
          metrics: {
            leadConversion: 10,
            workflowCompletion: 75,
            errorRate: 0.6,
            apiResponseTime: 520,
            concurrentUsers: 45,
            contractExecution: 85,
            complianceScore: 95
          },
          requirementsMatrix: [],
          approvedChanges: []
        },
        escalations: { active: [] },
        timeline: { morning: {}, afternoon: {}, evening: {} }
      }
    });

    render(
      <Provider store={warningStore}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    // Should display warning indicators
    expect(screen.getAllByText(/⚠/i).length).toBeGreaterThan(0);
  });

  test('renders footer with description', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    expect(screen.getByText(/Zoe's Executive Authority/i)).toBeInTheDocument();
  });

  test('status badges display correctly', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    const statusBadges = screen.getAllByText(/success|pending|warning/i);
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  test('requirement status column shows badge styling', () => {
    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );
    
    // Check for status-badge elements
    const badges = document.querySelectorAll('.status-badge');
    expect(badges.length).toBeGreaterThan(0);
  });
});
