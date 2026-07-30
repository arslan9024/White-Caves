import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import AssistantsTab from '../AssistantsTab';

describe('AssistantsTab Component', () => {
  it('renders AssistantsTab component without crashing', () => {
    const { container } = render(
      <AssistantsTab
        assistants={[]}
        departments={[]}
        selectedAssistant={null}
        onSelectAssistant={vi.fn()}
      />
    );
    expect(container).toBeDefined();
  });
});
