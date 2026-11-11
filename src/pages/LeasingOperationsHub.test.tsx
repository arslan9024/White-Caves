import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LeasingOperationsHub from './LeasingOperationsHub';

// Mock LindaWhatsAppCRM to keep tests isolated & fast
vi.mock('../components/crm/LindaWhatsAppCRM', () => ({
  default: () => <div data-testid="mock-linda-crm">Mock Linda WhatsApp CRM</div>,
}));

// Mock HenryTenancyContractModal
vi.mock('../components/crm/HenryDocumentStudio/HenryTenancyContractModal', () => ({
  HenryTenancyContractModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="mock-tenancy-modal">Mock Tenancy Modal</div> : null,
}));

const createMockStore = () =>
  configureStore({
    reducer: {
      linda: () => ({ sessions: [], stats: null, loading: false }),
    },
  });

describe('LeasingOperationsHub — Solo-Operator Command Center', () => {
  it('renders the hub header and tab navigation', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeasingOperationsHub />
      </Provider>
    );

    expect(screen.getByTestId('leasing-operations-hub')).toBeInTheDocument();
    expect(screen.getByText(/Solo-Operator Leasing Command Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Deals Pipeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Linda WhatsApp Landlord Broadcast/i)).toBeInTheDocument();
  });

  it('switches between tabs cleanly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeasingOperationsHub />
      </Provider>
    );

    const lindaTabBtn = screen.getByText(/Linda WhatsApp Landlord Broadcast/i);
    fireEvent.click(lindaTabBtn);
    expect(screen.getByTestId('mock-linda-crm')).toBeInTheDocument();

    const invoicingTabBtn = screen.getByText(/5% VAT Tax Invoices & PDCs/i);
    fireEvent.click(invoicingTabBtn);
    expect(screen.getByText(/Commission Tax Invoicing/i)).toBeInTheDocument();
  });

  it('records signature actions and updates UI', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeasingOperationsHub />
      </Provider>
    );

    const signTabBtn = screen.getByText(/UAE Pass & E-Signature/i);
    fireEvent.click(signTabBtn);

    const tenantSignBtns = screen.getAllByText(/Tenant Sign/i);
    fireEvent.click(tenantSignBtns[0]);

    expect(screen.getByText(/Zoe Notification:/i)).toBeInTheDocument();
  });
});
