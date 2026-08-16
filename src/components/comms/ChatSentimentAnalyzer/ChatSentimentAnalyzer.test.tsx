import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatSentimentAnalyzer } from './ChatSentimentAnalyzer';

describe('ChatSentimentAnalyzer Component', () => {
  it('renders chat sentiment analyzer and client sentiment indices', () => {
    render(<ChatSentimentAnalyzer />);
    expect(screen.getByTestId('chat-sentiment-analyzer')).toBeDefined();
    expect(screen.getByText(/WhatsApp Inbound NLP Sentiment & Intent Analyzer/i)).toBeDefined();
    expect(screen.getByText(/NINA NLP TELEMETRY/i)).toBeDefined();
    expect(screen.getByText(/Tariq Mansour/i)).toBeDefined();
    expect(screen.getByText(/Sergei Volkov/i)).toBeDefined();
  });
});
