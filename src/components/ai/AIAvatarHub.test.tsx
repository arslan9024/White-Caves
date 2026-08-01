import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AIAvatarHub from './AIAvatarHub';

describe('AIAvatarHub Component', () => {
  it('renders AI avatar hub title correctly', () => {
    render(<AIAvatarHub />);
    expect(screen.getByText('AI Avatar Intelligence Hub')).toBeDefined();
  });

  it('renders default AI avatars', () => {
    render(<AIAvatarHub />);
    expect(screen.getByText('Zoe')).toBeDefined();
    expect(screen.getByText('Nadia')).toBeDefined();
    expect(screen.getByText('Sentinel')).toBeDefined();
  });
});
