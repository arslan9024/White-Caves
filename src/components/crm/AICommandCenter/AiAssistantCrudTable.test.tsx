import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ThemeProvider } from '../../../context/ThemeContext';
import { AiAssistantCrudTable } from './AiAssistantCrudTable';

describe('AiAssistantCrudTable (Chakra UI Standardized Grid & CRUD Pathways)', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders root view with title, refresh button, and registered agents', () => {
    render(
      <ThemeProvider>
        <AiAssistantCrudTable />
      </ThemeProvider>
    );

    expect(screen.getByTestId('ai-assistant-crud-root')).toBeDefined();
    expect(screen.getByText(/AI Mesh Management & Sovereign Agent Ledger/i)).toBeDefined();
    expect(screen.getByTestId('chakra-agent-grid')).toBeDefined();
    expect(screen.getByTestId('agent-card-linda')).toBeDefined();
    expect(screen.getByTestId('agent-card-zoe')).toBeDefined();
  });

  it('opens creation drawer, registers a new agent, and adds to grid', () => {
    render(
      <ThemeProvider>
        <AiAssistantCrudTable />
      </ThemeProvider>
    );

    const addBtn = screen.getByTestId('add-ai-assistant-btn');
    fireEvent.click(addBtn);

    expect(screen.getByTestId('ai-assistant-form-card')).toBeDefined();

    fireEvent.change(screen.getByTestId('input-agent-id'), { target: { value: 'dept-02-sup-01' } });
    fireEvent.change(screen.getByTestId('input-agent-name'), {
      target: { value: 'Una View Primitives' },
    });
    fireEvent.change(screen.getByTestId('input-agent-role'), {
      target: { value: 'UI/UX Primitive Architect' },
    });

    fireEvent.click(screen.getByTestId('submit-create-agent-btn'));

    expect(screen.getByTestId('agent-card-dept-02-sup-01')).toBeDefined();
    expect(screen.getByText(/Una View Primitives/i)).toBeDefined();
  });

  it('deletes an agent from the grid view', () => {
    render(
      <ThemeProvider>
        <AiAssistantCrudTable />
      </ThemeProvider>
    );

    expect(screen.getByTestId('agent-card-ada')).toBeDefined();
    const deleteBtn = screen.getByTestId('delete-agent-ada');
    fireEvent.click(deleteBtn);

    expect(screen.queryByTestId('agent-card-ada')).toBeNull();
  });
});
