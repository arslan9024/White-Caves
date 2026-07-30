import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import ArchitectureTab from '../ArchitectureTab';

describe('ArchitectureTab Component', () => {
  it('renders ArchitectureTab component without crashing', () => {
    const mockTechStack = {
      frontend: ['React'],
      backend: ['Express'],
      database: ['MongoDB'],
      integrations: [],
      devops: [],
      uiPatterns: [],
    };

    const { container } = render(
      <ArchitectureTab modules={[]} techStack={mockTechStack} systemComponents={[]} />
    );
    expect(container).toBeDefined();
  });
});
