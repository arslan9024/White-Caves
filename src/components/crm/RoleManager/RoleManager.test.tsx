// FILE: src/components/crm/RoleManager/RoleManager.test.tsx
/**
 * White Caves Real Estate LLC - Role Manager 12-Way Vitest Unit Tests (Tier 6)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserRoleProvider } from '../../../context/UserRoleContext';
import { RoleManagerView } from './RoleManagerView';
import { RoleManagerFallback } from './RoleManager.fallback';
import { executeRoleAuditWorkflow, filterRolesByQuery } from './RoleManager.workflow';
import { indexRolesInMemory, getRoleById } from './RoleManager.cache';
import { evaluateRoleMatrixOffThread } from './RoleManager.workers';
import { ROLE_MANAGER_I18N } from './RoleManager.i18n';
import { CANONICAL_SOVEREIGN_ROLES } from './RoleManager.data';

describe('RoleManager Suite (12-Way Co-Location Blueprint)', () => {
  it('renders workspace title, metrics deck, and canonical role cards', () => {
    render(
      <UserRoleProvider>
        <RoleManagerView />
      </UserRoleProvider>
    );

    expect(screen.getByText(/User Role & Sovereign RBAC Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Sovereign Roles/i)).toBeInTheDocument();
    expect(screen.getByText(/Managing Director \(Founder\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Asset Owner \(Landlord\)/i)).toBeInTheDocument();
  });

  it('filters roles by search query', () => {
    render(
      <UserRoleProvider>
        <RoleManagerView />
      </UserRoleProvider>
    );

    const searchInput = screen.getByTestId('role-search-input');
    fireEvent.change(searchInput, { target: { value: 'landlord' } });

    expect(screen.getByText(/Asset Owner \(Landlord\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/Managing Director \(Founder\)/i)).not.toBeInTheDocument();
  });

  it('filters roles by tier pills', () => {
    render(
      <UserRoleProvider>
        <RoleManagerView />
      </UserRoleProvider>
    );

    const clientPortalsBtn = screen.getByTestId('tier-filter-tier2');
    fireEvent.click(clientPortalsBtn);

    expect(screen.getByText(/Asset Owner \(Landlord\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Resident Tenant/i)).toBeInTheDocument();
    expect(screen.queryByText(/Managing Director \(Founder\)/i)).not.toBeInTheDocument();
  });

  it('simulates role switch when simulate button is triggered', () => {
    render(
      <UserRoleProvider>
        <RoleManagerView />
      </UserRoleProvider>
    );

    const landlordSimBtn = screen.getByTestId('simulate-btn-landlord');
    expect(landlordSimBtn).toBeInTheDocument();

    fireEvent.click(landlordSimBtn);
    expect(screen.getByText(/Simulating: LANDLORD/i)).toBeInTheDocument();
  });

  it('renders RoleManagerFallback component with retry action', () => {
    const onRetry = vi.fn();
    render(<RoleManagerFallback error={new Error('Security Audit Failure')} onRetry={onRetry} />);

    expect(screen.getByText(/Role & RBAC Security Exception/i)).toBeInTheDocument();
    expect(screen.getByText(/Security Audit Failure/i)).toBeInTheDocument();

    const retryBtn = screen.getByTestId('role-fallback-retry-btn');
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('verifies pure 4-stage workflow audit engine (Tier 7)', () => {
    const mdRole = CANONICAL_SOVEREIGN_ROLES[0];
    const auditResult = executeRoleAuditWorkflow(mdRole, 5);

    expect(auditResult.passed).toBe(true);
    expect(auditResult.clearanceVerified).toBe(true);
    expect(auditResult.privilegeEscalationRisk).toBe(false);
    expect(auditResult.auditAttestationToken).toContain('RBAC-ATTEST-MANAGING_DIRECTOR');

    // Escalation test: Level 2 user attempting Level 5 role
    const escalationResult = executeRoleAuditWorkflow(mdRole, 2);
    expect(escalationResult.clearanceVerified).toBe(false);
    expect(escalationResult.privilegeEscalationRisk).toBe(true);

    const filtered = filterRolesByQuery(CANONICAL_SOVEREIGN_ROLES, 'Tenant');
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered[0].id).toBe('tenant');
  });

  it('indexes roles in memory with O(1) cache lookup (Tier 11)', () => {
    indexRolesInMemory(CANONICAL_SOVEREIGN_ROLES);
    const role = getRoleById('LANDLORD');

    expect(role).not.toBeNull();
    expect(role?.name).toContain('Landlord');
    expect(role?.accessLevel).toBe(2);

    const codeLookup = getRoleById('MD-01');
    expect(codeLookup).not.toBeNull();
    expect(codeLookup?.id).toBe('managing_director');
  });

  it('evaluates role matrix off-thread via worker (Tier 12)', async () => {
    const result = await evaluateRoleMatrixOffThread({
      roles: CANONICAL_SOVEREIGN_ROLES,
      activeRole: 'managing_director',
      activeLevel: 5,
    });

    expect(result.accessibleRolesCount).toBe(CANONICAL_SOVEREIGN_ROLES.length);
    expect(result.securityIndexScore).toBe(100);
    expect(result.attestationStamp).toContain('RBAC-SEC-SCORE');
  });

  it('asserts 4-language i18n translation completeness (Tier 10)', () => {
    const en = ROLE_MANAGER_I18N.en;
    const ar = ROLE_MANAGER_I18N.ar;
    const es = ROLE_MANAGER_I18N.es;
    const ru = ROLE_MANAGER_I18N.ru;

    expect(en.dir).toBe('ltr');
    expect(ar.dir).toBe('rtl');
    expect(es.workspaceTitle).toContain('Matriz de Roles');
    expect(ru.workspaceTitle).toContain('Матрица');
  });
});
