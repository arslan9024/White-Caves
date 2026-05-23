import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('../RolePages.css', () => ({}));

import TitleDeedRegistrationPage from './TitleDeedRegistrationPage';

describe('TitleDeedRegistrationPage', () => {
  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders page title', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Title Deed Registration')).toBeInTheDocument();
    });

    it('renders page description', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Complete guide to property ownership transfer in Dubai')).toBeInTheDocument();
    });

    it('renders Registration Process heading', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Registration Process')).toBeInTheDocument();
    });
  });

  // ── Steps ──────────────────────────────────────────────────
  describe('timeline steps', () => {
    it('renders all 6 steps', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('renders Step 1: Sign MOU', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Sign Memorandum of Understanding (MOU)')).toBeInTheDocument();
    });

    it('renders Step 2: Obtain NOC', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Obtain No Objection Certificate (NOC)')).toBeInTheDocument();
    });

    it('renders Step 3: Mortgage Pre-Approval', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Mortgage Pre-Approval (if applicable)')).toBeInTheDocument();
    });

    it('renders Step 4: Block Transfer', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Block Transfer at Trustee Office')).toBeInTheDocument();
    });

    it('renders Step 5: Transfer Ownership', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Transfer Ownership at DLD')).toBeInTheDocument();
    });

    it('renders Step 6: Receive Title Deed', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Receive New Title Deed')).toBeInTheDocument();
    });

    it('renders step timelines', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Day 1')).toBeInTheDocument();
      expect(screen.getByText('3-5 business days')).toBeInTheDocument();
      expect(screen.getByText('5-10 business days')).toBeInTheDocument();
    });

    it('renders step descriptions', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText(/Buyer and seller sign Form F/)).toBeInTheDocument();
      expect(screen.getByText(/Seller applies for NOC from the developer/)).toBeInTheDocument();
    });

    it('renders step documents', () => {
      render(<TitleDeedRegistrationPage />);
      const emiratesIds = screen.getAllByText('Valid Emirates ID or Passport');
      expect(emiratesIds.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Signed Form F')).toBeInTheDocument();
      expect(screen.getByText('Property valuation report')).toBeInTheDocument();
    });
  });

  // ── Document Checklist ─────────────────────────────────────
  describe('document checklist', () => {
    it('renders Document Checklist heading', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Document Checklist')).toBeInTheDocument();
    });

    it('renders Buyer category', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Buyer')).toBeInTheDocument();
    });

    it('renders Seller category', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Seller')).toBeInTheDocument();
    });

    it('renders Financial category', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Financial')).toBeInTheDocument();
    });

    it('renders buyer documents', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Passport copy with visa page')).toBeInTheDocument();
      expect(screen.getByText('Power of Attorney (if applicable)')).toBeInTheDocument();
    });

    it('renders seller documents', () => {
      render(<TitleDeedRegistrationPage />);
      // These texts may appear in both timeline steps and document checklist
      const titleDeeds = screen.getAllByText('Original Title Deed');
      expect(titleDeeds.length).toBeGreaterThanOrEqual(1);
      const nocs = screen.getAllByText('NOC from Developer');
      expect(nocs.length).toBeGreaterThanOrEqual(1);
      const serviceCharge = screen.getAllByText(/Service charge clearance|service charge/i);
      expect(serviceCharge.length).toBeGreaterThanOrEqual(1);
    });

    it('renders financial documents', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText("Manager's cheques for purchase amount")).toBeInTheDocument();
      expect(screen.getByText("Manager's cheque for DLD fees")).toBeInTheDocument();
      expect(screen.getByText('Mortgage approval letter (if applicable)')).toBeInTheDocument();
    });

    it('renders checkboxes for each document', () => {
      render(<TitleDeedRegistrationPage />);
      const checkboxes = screen.getAllByRole('checkbox');
      // 3 buyer + 4 seller + 3 financial = 10
      expect(checkboxes.length).toBe(10);
    });
  });

  // ── Fees Summary ───────────────────────────────────────────
  describe('fees summary', () => {
    it('renders Transfer Fees Summary heading', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Transfer Fees Summary')).toBeInTheDocument();
    });

    it('renders DLD Transfer Fee', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('DLD Transfer Fee')).toBeInTheDocument();
      expect(screen.getByText('4% of property value')).toBeInTheDocument();
    });

    it('renders DLD Admin Fee', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('DLD Admin Fee')).toBeInTheDocument();
      expect(screen.getByText('AED 580')).toBeInTheDocument();
    });

    it('renders Trustee Fee (Cash)', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Trustee Fee (Cash)')).toBeInTheDocument();
      expect(screen.getByText('AED 2,100 + VAT')).toBeInTheDocument();
    });

    it('renders Trustee Fee (Mortgage)', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Trustee Fee (Mortgage)')).toBeInTheDocument();
      expect(screen.getByText('AED 4,200 + VAT')).toBeInTheDocument();
    });

    it('renders Mortgage Registration fee', () => {
      render(<TitleDeedRegistrationPage />);
      expect(screen.getByText('Mortgage Registration')).toBeInTheDocument();
      expect(screen.getByText('0.25% of loan + AED 290')).toBeInTheDocument();
    });
  });
});
