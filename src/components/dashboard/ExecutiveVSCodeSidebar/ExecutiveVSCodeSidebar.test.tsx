import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExecutiveVSCodeSidebar from './ExecutiveVSCodeSidebar';

describe('ExecutiveVSCodeSidebar Component (7-Category Co-Location Spec)', () => {
  it('renders Departments Hub drawer and corporate activity bar by default', () => {
    render(<ExecutiveVSCodeSidebar />);
    expect(screen.getByText(/Departments Hub/i)).toBeInTheDocument();
  });

  it('renders 5th Activity Bar icon for Corporate Departments and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const empBtn = screen.getByTestId('activity-btn-employees');
    fireEvent.click(empBtn);
    expect(onSelectTab).toHaveBeenCalledWith('employees');

    const deptBtn = screen.getByTestId('activity-btn-departments');
    fireEvent.click(deptBtn);
    expect(onSelectTab).toHaveBeenCalledWith('departments');
    expect(screen.getByText(/Departments Hub/i)).toBeInTheDocument();
  }, 15000);

  it('renders 6th Activity Bar icon for Employees and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const empBtn = screen.getByTestId('activity-btn-employees');
    expect(empBtn).toBeInTheDocument();

    fireEvent.click(empBtn);
    expect(onSelectTab).toHaveBeenCalledWith('employees');
    expect(screen.getByText(/Employees Hub/i)).toBeInTheDocument();
  }, 15000);

  it('renders 7th Activity Bar icon for Tasks and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const taskBtn = screen.getByTestId('activity-btn-tasks');
    expect(taskBtn).toBeInTheDocument();

    fireEvent.click(taskBtn);
    expect(onSelectTab).toHaveBeenCalledWith('tasks');
    expect(screen.getByText(/200\+ Tasks Catalog/i)).toBeInTheDocument();
  }, 15000);

  it('renders 8th Activity Bar icon for Leaderboard and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const leadBtn = screen.getByTestId('activity-btn-leaderboard');
    expect(leadBtn).toBeInTheDocument();

    fireEvent.click(leadBtn);
    expect(onSelectTab).toHaveBeenCalledWith('leaderboard');
    expect(screen.getByText(/Merit Leaderboard & Tiers/i)).toBeInTheDocument();
  }, 15000);

  it('renders 9th Activity Bar icon for REproperties and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const propBtn = screen.getByTestId('activity-btn-reproperties');
    expect(propBtn).toBeInTheDocument();

    fireEvent.click(propBtn);
    expect(onSelectTab).toHaveBeenCalledWith('REproperties');
    expect(screen.getByText(/RE Properties Inventory/i)).toBeInTheDocument();
  }, 15000);

  it('renders Activity Bar icon for Deals and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const dealsBtn = screen.getByTestId('activity-btn-deals');
    expect(dealsBtn).toBeInTheDocument();

    fireEvent.click(dealsBtn);
    expect(onSelectTab).toHaveBeenCalledWith('deals');
    expect(screen.getByText(/Deals & Pipeline/i)).toBeInTheDocument();
  }, 15000);

  it('renders Activity Bar icon for Documents and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const docBtn = screen.getByTestId('activity-btn-documents');
    expect(docBtn).toBeInTheDocument();

    fireEvent.click(docBtn);
    expect(onSelectTab).toHaveBeenCalledWith('documents');
    expect(screen.getAllByText(/Document Vault/i).length).toBeGreaterThan(0);
  }, 15000);

  it('renders Activity Bar icon for Relationships and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const relBtn = screen.getByTestId('activity-btn-relationships');
    expect(relBtn).toBeInTheDocument();

    fireEvent.click(relBtn);
    expect(onSelectTab).toHaveBeenCalledWith('relationships');
    expect(screen.getByText(/Relational Matrix/i)).toBeInTheDocument();
  }, 15000);

  it('renders Activity Bar icon for Customers and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const custBtn = screen.getByTestId('activity-btn-customers');
    expect(custBtn).toBeInTheDocument();

    fireEvent.click(custBtn);
    expect(onSelectTab).toHaveBeenCalledWith('customers');
    expect(screen.getByText(/Customers Hub \(CRM\)/i)).toBeInTheDocument();
  }, 15000);
});
