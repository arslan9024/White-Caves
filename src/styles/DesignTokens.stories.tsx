import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { theme } from '../../../styles/theme';

/**
 * Design Tokens — Visual catalog of the White Caves design system
 * Showcases colors, spacing, typography, shadows, and radius values.
 */

// ─────────────────────────────────────────────────────────────
// Color Swatch Component
// ─────────────────────────────────────────────────────────────

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          backgroundColor: value,
          border: '1px solid #e2e8f0',
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>{name}</div>
        <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>{value}</div>
      </div>
    </div>
  );
}

function ColorGroup({ title, colors }: { title: string; colors: Record<string, string | Record<string, string>> }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ marginBottom: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
        {title}
      </h3>
      {Object.entries(colors).map(([key, value]) => {
        if (typeof value === 'string') {
          return <ColorSwatch key={key} name={key} value={value} />;
        }
        return (
          <div key={key} style={{ marginLeft: '16px', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>{key}</h4>
            {Object.entries(value).map(([subKey, subValue]) => (
              <ColorSwatch key={`${key}-${subKey}`} name={`${key}.${subKey}`} value={subValue as string} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Design Tokens Component
// ─────────────────────────────────────────────────────────────

function DesignTokensPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', fontFamily: theme.typography.fontFamily.primary }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>🎨 White Caves Design Tokens</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        Visual catalog of design tokens used across the White Caves CRM platform.
      </p>

      {/* Colors */}
      <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>Colors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <ColorGroup title="Primary" colors={typeof theme.colors.primary === 'object' ? theme.colors.primary as any : { primary: theme.colors.primary }} />
        <ColorGroup title="Text" colors={theme.colors.text as any} />
        <ColorGroup title="Background" colors={theme.colors.background as any} />
        <ColorGroup title="Status" colors={theme.colors.status as any} />
      </div>

      {/* Spacing */}
      <h2 style={{ fontSize: '22px', margin: '32px 0 16px' }}>Spacing</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        {Object.entries(theme.spacing).map(([key, value]) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: value,
                height: value,
                backgroundColor: '#3b82f6',
                borderRadius: '4px',
                minWidth: '8px',
                minHeight: '8px',
              }}
            />
            <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>{key}</div>
            <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Typography */}
      <h2 style={{ fontSize: '22px', margin: '32px 0 16px' }}>Typography</h2>
      <div style={{ marginBottom: '32px' }}>
        {Object.entries(theme.typography.fontSize).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '12px', display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <span style={{ fontSize: value, fontWeight: 500 }}>The quick brown fox</span>
            <span style={{ fontSize: '12px', color: '#888', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
              {key}: {value}
            </span>
          </div>
        ))}
      </div>

      {/* Shadows */}
      <h2 style={{ fontSize: '22px', margin: '32px 0 16px' }}>Shadows</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
        {Object.entries(theme.shadows).map(([key, value]) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: value,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{key}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Border Radius */}
      <h2 style={{ fontSize: '22px', margin: '32px 0 16px' }}>Border Radius</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
        {Object.entries(theme.radius).map(([key, value]) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#3b82f6',
                borderRadius: value,
              }}
            />
            <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>{key}</div>
            <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Design Tokens',
  component: DesignTokensPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete visual catalog of the White Caves design token system.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const AllTokens: Story = {};
