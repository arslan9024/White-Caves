import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock all data imports
vi.mock('../../data/assistants', () => ({
  AI_ASSISTANTS_REGISTRY: [
    { id: 'nadia', name: 'Nadia', title: 'WhatsApp CRM Manager', department: 'Communications', status: 'active', features: ['Chat Management'], connections: ['Clara'] },
    { id: 'clara', name: 'Clara', title: 'Leads CRM Manager', department: 'Sales', status: 'active', features: ['Lead Tracking'], connections: ['Nadia'] },
    { id: 'theodora', name: 'Theodora', title: 'Finance Manager', department: 'Finance', status: 'inactive', features: ['Accounting'], connections: [] },
    { id: 'sophia', name: 'Sophia', title: 'Sales CRM Manager', department: 'Sales', status: 'active', features: ['Sales Pipeline'], connections: ['Clara'] },
  ],
}));

vi.mock('../../data/modules', () => ({
  PLATFORM_MODULES: [
    {
      category: 'Core Business',
      modules: [
        { name: 'CRM', description: 'Customer management', status: 'production' },
        { name: 'Inventory', description: 'Property tracking', status: 'production' },
        { name: 'Reports', description: 'Analytics', status: 'development' },
      ],
    },
    {
      category: 'AI & Automation',
      modules: [
        { name: 'Chatbot', description: 'AI assistant', status: 'production' },
      ],
    },
  ],
}));

vi.mock('../../data/architecture', () => ({
  TECH_STACK: {
    frontend: ['React 18', 'TypeScript'],
    backend: ['Node.js', 'Express'],
    database: ['MongoDB'],
    integrations: ['Firebase'],
    devops: ['Docker'],
    uiPatterns: ['Responsive'],
  },
  SYSTEM_COMPONENTS: [
    { id: 'api', name: 'CRM API', type: 'api', status: 'healthy', metrics: { cpu: 45, memory: 62, responseTime: 128, uptime: 99.98 } },
    { id: 'db', name: 'MongoDB', type: 'database', status: 'healthy', metrics: { cpu: 30, memory: 50, responseTime: 15, uptime: 99.99 } },
    { id: 'fe', name: 'Frontend', type: 'frontend', status: 'degraded', metrics: { cpu: 60, memory: 70, responseTime: 200, uptime: 99.5 } },
  ],
}));

vi.mock('../../data/features', () => ({
  CTO_FEATURES: ['System monitoring', 'Health checks', 'Performance optimization'],
}));

import { useCTOData } from '../useCTOData';

describe('useCTOData', () => {
  describe('stats', () => {
    it('should compute total assistants count', () => {
      const { result } = renderHook(() => useCTOData());
      expect(result.current.stats.totalAssistants).toBe(4);
    });

    it('should compute active assistants count', () => {
      const { result } = renderHook(() => useCTOData());
      // 3 active (Nadia, Clara, Sophia), 1 inactive (Theodora)
      expect(result.current.stats.activeAssistants).toBe(3);
    });

    it('should compute total modules across categories', () => {
      const { result } = renderHook(() => useCTOData());
      // 3 + 1 = 4
      expect(result.current.stats.totalModules).toBe(4);
    });

    it('should compute production modules count', () => {
      const { result } = renderHook(() => useCTOData());
      // CRM, Inventory, Chatbot = 3 production (Reports is development)
      expect(result.current.stats.productionModules).toBe(3);
    });

    it('should compute system health percentage', () => {
      const { result } = renderHook(() => useCTOData());
      // 2 healthy out of 3 = 66.66...%
      const expected = (2 / 3) * 100;
      expect(result.current.stats.systemHealth).toBeCloseTo(expected);
    });
  });

  describe('departments', () => {
    it('should group assistants by department', () => {
      const { result } = renderHook(() => useCTOData());
      const depts = result.current.departments;

      expect(Object.keys(depts)).toContain('Communications');
      expect(Object.keys(depts)).toContain('Sales');
      expect(Object.keys(depts)).toContain('Finance');
    });

    it('should have correct count per department', () => {
      const { result } = renderHook(() => useCTOData());
      const depts = result.current.departments;

      expect(depts['Communications']).toHaveLength(1);
      expect(depts['Sales']).toHaveLength(2); // Clara + Sophia
      expect(depts['Finance']).toHaveLength(1);
    });

    it('should preserve assistant data within departments', () => {
      const { result } = renderHook(() => useCTOData());
      const salesDept = result.current.departments['Sales'];

      expect(salesDept.find(a => a.id === 'clara')).toBeDefined();
      expect(salesDept.find(a => a.id === 'sophia')).toBeDefined();
    });
  });

  describe('assistant selection', () => {
    it('should start with null selected assistant', () => {
      const { result } = renderHook(() => useCTOData());
      expect(result.current.selectedAssistant).toBeNull();
    });

    it('should select an assistant via onSelectAssistant', () => {
      const { result } = renderHook(() => useCTOData());
      const assistant = result.current.assistants[0];

      act(() => {
        result.current.onSelectAssistant(assistant);
      });

      expect(result.current.selectedAssistant).toEqual(assistant);
      expect(result.current.selectedAssistant?.id).toBe('nadia');
    });

    it('should update selection when different assistant chosen', () => {
      const { result } = renderHook(() => useCTOData());

      act(() => {
        result.current.onSelectAssistant(result.current.assistants[0]);
      });
      expect(result.current.selectedAssistant?.id).toBe('nadia');

      act(() => {
        result.current.onSelectAssistant(result.current.assistants[1]);
      });
      expect(result.current.selectedAssistant?.id).toBe('clara');
    });
  });

  describe('exposed data', () => {
    it('should expose assistants registry', () => {
      const { result } = renderHook(() => useCTOData());
      expect(result.current.assistants).toHaveLength(4);
    });

    it('should expose modules data', () => {
      const { result } = renderHook(() => useCTOData());
      expect(result.current.modules).toHaveLength(2);
    });

    it('should expose tech stack', () => {
      const { result } = renderHook(() => useCTOData());
      expect(result.current.techStack.frontend).toContain('React 18');
      expect(result.current.techStack.backend).toContain('Node.js');
    });

    it('should expose system components', () => {
      const { result } = renderHook(() => useCTOData());
      expect(result.current.systemComponents).toHaveLength(3);
    });

    it('should expose initial system status as operational', () => {
      const { result } = renderHook(() => useCTOData());
      expect(result.current.systemStatus).toBe('operational');
    });

    it('should expose CTO features', () => {
      const { result } = renderHook(() => useCTOData());
      expect(result.current.features).toHaveLength(3);
      expect(result.current.features[0]).toBe('System monitoring');
    });
  });
});
