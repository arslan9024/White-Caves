import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthModalProvider, useAuthModal } from '../AuthModalProvider';

const TestChild: React.FC = () => {
  const { openAuthModal, isAuthModalOpen } = useAuthModal();
  return (
    <div>
      <span data-testid="status">{isAuthModalOpen ? 'open' : 'closed'}</span>
      <button onClick={() => openAuthModal('signin')}>Open Modal</button>
    </div>
  );
};

describe('AuthModalProvider Component', () => {
  it('provides auth modal context to child components', () => {
    render(
      <AuthModalProvider>
        <TestChild />
      </AuthModalProvider>
    );
    expect(screen.getByTestId('status').textContent).toBe('closed');
  });
});
