/**
 * White Caves Real Estate LLC - Global Command Palette Index Data
 * Architecture: AEGIS Canonical 7-Category Architecture Standard (Static Data)
 * Single Purpose File Law: < 350 lines
 */

import { CommandPaletteEntityItem } from './GlobalEntityCommandPalette.types';
import { FALLBACK_12_DEPARTMENTS } from '../../crm/DepartmentManager/DepartmentManager.data';
import { INITIAL_EMPLOYEES_SEED } from '../../crm/EmployeeManager/EmployeeManager.data';
import { buildCanonical200Tasks } from '../../crm/TaskManager/TaskManager.data';
import { CANONICAL_RE_PROPERTIES } from '../../crm/REPropertyManager/REPropertyManager.data';
import { CANONICAL_DEALS } from '../../crm/DealManager/DealManager.data';
import { CANONICAL_DOCUMENTS } from '../../crm/DocumentManager/DocumentManager.data';
import { INITIAL_LEADERBOARD_DATA } from '../../crm/Leaderboard/Leaderboard.data';
import { CANONICAL_RELATIONSHIPS } from '../../crm/RelationshipManager/RelationshipManager.data';
import { CANONICAL_CUSTOMERS } from '../../crm/CustomerManager/CustomerManager.data';

export function buildGlobalCommandPaletteIndex(): CommandPaletteEntityItem[] {
  const items: CommandPaletteEntityItem[] = [];

  // 1. Departments (12)
  FALLBACK_12_DEPARTMENTS.forEach(dept => {
    const code = dept.code || `D${dept.order}`;
    items.push({
      id: code,
      title: dept.title,
      subtitle: dept.description || `Department ${code}`,
      category: 'DEPARTMENTS',
      categoryLabel: 'Departments',
      badge: code,
      badgeColor: dept.color || '#3B82F6',
      route: `/dashboard/departments/${code}`,
      keywords: [dept.title, code, dept.slug, 'department', 'corporate', 'director'],
    });
  });

  // 2. Employees (108)
  (INITIAL_EMPLOYEES_SEED || []).forEach(emp => {
    const code = emp.employeeCode || emp._id;
    items.push({
      id: code,
      title: emp.fullName,
      subtitle: `${emp.designation} · ${emp.departmentName || emp.pillarName}`,
      category: 'EMPLOYEES',
      categoryLabel: 'Employees',
      badge: emp.roleTier,
      badgeColor: '#10B981',
      route: `/dashboard/employees/${code}`,
      keywords: [
        emp.fullName,
        code,
        emp.email,
        emp.designation,
        emp.pillarName,
        emp.reraCardNumber || '',
        'broker',
        'personnel',
      ],
    });
  });

  // 3. Properties (100)
  CANONICAL_RE_PROPERTIES.forEach(prop => {
    const code = prop.repropertyId || prop._id;
    items.push({
      id: code,
      title: prop.title,
      subtitle: `${prop.location} · AED ${(prop.priceAED / 1_000_000).toFixed(1)}M · ${prop.propertyType}`,
      category: 'PROPERTIES',
      categoryLabel: 'Properties',
      badge: prop.status,
      badgeColor: prop.status === 'AVAILABLE' ? '#10B981' : '#F59E0B',
      route: `/dashboard/REproperties/${code}`,
      keywords: [
        prop.title,
        code,
        prop.location,
        prop.propertyType,
        prop.developer,
        prop.trakheesiPermit,
        'villa',
        'real estate',
      ],
    });
  });

  // 4. Deals (100)
  CANONICAL_DEALS.forEach(deal => {
    items.push({
      id: deal.id,
      title: `${deal.dealNumber}: ${deal.title}`,
      subtitle: `${deal.dealType} · AED ${(deal.valueAED / 1_000).toFixed(0)}k · ${deal.status}`,
      category: 'DEALS',
      categoryLabel: 'Deals',
      badge: deal.status,
      badgeColor: '#8B5CF6',
      route: `/dashboard/deals/${deal.id}`,
      keywords: [
        deal.id,
        deal.dealNumber,
        deal.title,
        deal.dealType,
        deal.status,
        deal.agentName,
        deal.clientName,
        'deal',
        'commission',
      ],
    });
  });

  // 5. Customers & CRM (100)
  CANONICAL_CUSTOMERS.forEach(cust => {
    items.push({
      id: cust.id,
      title: `${cust.customerCode}: ${cust.fullName}`,
      subtitle: `${cust.customerType} · ${cust.preferredCommunity} · Step ${cust.currentStep}/18`,
      category: 'CUSTOMERS',
      categoryLabel: 'Customers & CRM',
      badge: cust.customerType,
      badgeColor: '#EC4899',
      route: `/dashboard/customers/${cust.id}`,
      keywords: [
        cust.id,
        cust.customerCode,
        cust.fullName,
        cust.email,
        cust.phone,
        cust.customerType,
        cust.preferredCommunity,
        'lead',
        'tenant',
        'client',
      ],
    });
  });

  // 6. Documents & Henry OCR (100)
  CANONICAL_DOCUMENTS.forEach(doc => {
    items.push({
      id: doc.id,
      title: `${doc.docCode}: ${doc.title}`,
      subtitle: `${doc.docType} · ${doc.entityName} · OCR: ${doc.ocrConfidence}%`,
      category: 'DOCUMENTS',
      categoryLabel: 'Documents & OCR',
      badge: doc.status,
      badgeColor: doc.status === 'VERIFIED' ? '#10B981' : '#F59E0B',
      route: `/dashboard/documents/${doc.id}`,
      keywords: [
        doc.id,
        doc.docCode,
        doc.title,
        doc.docType,
        doc.entityName,
        'document',
        'title deed',
        'ejari',
        'passport',
      ],
    });
  });

  // 7. Tasks (Top statutory & operational)
  const tasks = typeof buildCanonical200Tasks === 'function' ? buildCanonical200Tasks() : [];
  tasks.slice(0, 50).forEach(task => {
    items.push({
      id: task._id,
      title: `${task.taskCode}: ${task.title}`,
      subtitle: `${task.pillarName || task.category} · Actor: ${task.actor || 'Managing Director'}`,
      category: 'TASKS',
      categoryLabel: 'Tasks',
      badge: task.status || 'READY',
      badgeColor: '#06B6D4',
      route: `/dashboard/tasks/${task._id}`,
      keywords: [
        task._id,
        task.taskCode,
        task.title,
        task.pillarName || '',
        task.category || '',
        task.actor || '',
        task.action || '',
        'task',
        'statutory',
      ],
    });
  });

  // 8. Relationships & Matrix
  CANONICAL_RELATIONSHIPS.forEach(rel => {
    items.push({
      id: rel.id,
      title: `${rel.dealNumber}: ${rel.name}`,
      subtitle: `Revenue: AED ${rel.grossRevenueAED.toLocaleString()} · XP: +${rel.meritXPAwarded}`,
      category: 'RELATIONSHIPS',
      categoryLabel: 'Relationship Matrix',
      badge: 'GRAPH',
      badgeColor: '#F59E0B',
      route: `/dashboard/relationships/${rel.id}`,
      keywords: [rel.id, rel.dealNumber, rel.name, rel.summary, 'relationship', 'graph', 'chain'],
    });
  });

  // 9. Leaderboard & Merit
  INITIAL_LEADERBOARD_DATA.forEach(lb => {
    items.push({
      id: lb.id,
      title: `${lb.name} (Tier ${lb.currentTier})`,
      subtitle: `${lb.currentRole} · XP: ${lb.meritXp.toLocaleString()} · SLA: ${lb.slaOnTimeRate}%`,
      category: 'LEADERBOARD',
      categoryLabel: 'Leaderboard',
      badge: lb.promotionStatus,
      badgeColor: '#EAB308',
      route: `/dashboard/leaderboard/${lb.id}`,
      keywords: [
        lb.id,
        lb.name,
        lb.currentTier,
        lb.currentRole,
        lb.departmentName,
        'leaderboard',
        'merit',
        'xp',
      ],
    });
  });

  return items;
}
