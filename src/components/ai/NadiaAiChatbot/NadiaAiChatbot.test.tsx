import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NadiaAiChatbot from './NadiaAiChatbot';

describe('NadiaAiChatbot Component', () => {
  it('renders without crashing and displays Nadia conversational assistant', () => {
    render(<NadiaAiChatbot />);
    expect(screen.getByTestId('nadia-ai-chatbot')).toBeDefined();
  });
});
