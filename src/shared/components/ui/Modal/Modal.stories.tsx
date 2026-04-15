import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ModalBase as Modal } from './Modal';

/**
 * Modal — Accessible dialog component with focus trapping, overlay click,
 * and Escape key dismissal. Used throughout White Caves CRM for:
 * detail views, forms, confirmations, and full-screen displays.
 */
const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean', description: 'Whether the modal is visible' },
    title: { control: 'text', description: 'Header title text' },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'full'],
      description: 'Size preset',
    },
    showCloseButton: { control: 'boolean' },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A fully accessible modal dialog with focus trap, keyboard navigation (Tab cycling, Escape close), ' +
          'overlay click dismiss, and body scroll lock. Rendered via React portal.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Property Details',
    size: 'medium',
    showCloseButton: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    children: (
      <div style={{ padding: '16px' }}>
        <p>This is a modal dialog used across the White Caves CRM platform.</p>
        <p style={{ marginTop: '8px', color: '#666' }}>
          Try pressing Escape, Tab (for focus cycling), or clicking the overlay.
        </p>
      </div>
    ),
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    title: 'Confirm Action',
    size: 'small',
    children: (
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <p>Are you sure you want to delete this lead?</p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button style={{ padding: '8px 24px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Delete
          </button>
          <button style={{ padding: '8px 24px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    title: 'Lead Management — Full Details',
    size: 'large',
    children: (
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <h3>Contact Information</h3>
            <p>Name: Ahmed Al-Rashid</p>
            <p>Phone: +971 50 123 4567</p>
            <p>Email: ahmed@example.com</p>
          </div>
          <div>
            <h3>Property Interest</h3>
            <p>Type: 3BR Apartment</p>
            <p>Area: Dubai Marina</p>
            <p>Budget: AED 2.5M – 3.5M</p>
          </div>
        </div>
      </div>
    ),
  },
};

export const FullScreen: Story = {
  args: {
    ...Default.args,
    title: 'Property Gallery',
    size: 'full',
    children: (
      <div style={{ padding: '24px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <p style={{ fontSize: '48px' }}>🏢</p>
          <p>Full-screen property gallery viewer would render here.</p>
        </div>
      </div>
    ),
  },
};

export const NoTitle: Story = {
  args: {
    isOpen: true,
    size: 'small',
    showCloseButton: true,
    children: (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '32px' }}>✅</p>
        <p style={{ marginTop: '8px', fontWeight: 'bold' }}>Success!</p>
        <p style={{ color: '#666' }}>Your property has been listed.</p>
      </div>
    ),
  },
};

/**
 * Interactive demo with a button that opens/closes the modal.
 */
export const Interactive: Story = {
  render: function InteractiveModal() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ padding: '40px' }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Open Modal
        </button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Interactive Demo"
          size="medium"
        >
          <div style={{ padding: '16px' }}>
            <p>This modal was opened by clicking the button.</p>
            <p style={{ marginTop: '8px', color: '#666' }}>
              Close it with Escape, the X button, or clicking the overlay.
            </p>
          </div>
        </Modal>
      </div>
    );
  },
};
