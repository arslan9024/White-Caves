import React from 'react';

const META_POLICY_SECTIONS = [
  {
    title: 'User Opt-In',
    description: 'Send messages only when user consent is captured and auditable.',
  },
  {
    title: '24-Hour Service Window',
    description: 'Outside the customer service window, use approved templates.',
  },
  {
    title: 'Template Compliance',
    description: 'Use approved, non-spammy templates with clear business intent.',
  },
  {
    title: 'Prohibited Content',
    description: 'Avoid restricted categories and misleading promotional claims.',
  },
  {
    title: 'Privacy & Data Handling',
    description: 'Use least-privilege access and transparent customer data handling.',
  },
];

const NadiaMetaPoliciesPanel: React.FC = () => {
  return (
    <div
      style={{
        marginTop: '12px',
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        background: '#F9FAFB',
        padding: '12px',
      }}
    >
      <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--color-1f2937, #1F2937)' }}>
        📘 Meta Policies (Nadia Knowledge)
      </h4>
      <ul style={{ margin: 0, paddingLeft: '16px', display: 'grid', gap: '6px' }}>
        {META_POLICY_SECTIONS.map(section => (
          <li key={section.title} style={{ fontSize: '12px', color: 'var(--text-secondary, #374151)' }}>
            <strong>{section.title}:</strong> {section.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NadiaMetaPoliciesPanel;
