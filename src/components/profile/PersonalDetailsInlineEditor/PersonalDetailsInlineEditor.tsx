import React, { FC, useState } from 'react';
import styled from 'styled-components';

const EditorCard = styled.div`
  padding: 1.25rem;
  background: #0F172A;
  border: 2px solid #EF4444;
  border-radius: 14px;
  color: #FFFFFF;
  margin-top: 1rem;
`;

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  input {
    background: #1E293B;
    border: 1px solid #EF4444;
    border-radius: 6px;
    padding: 6px 12px;
    color: #FFFFFF;
    font-size: 0.88rem;
    outline: none;
  }
`;

export const PersonalDetailsInlineEditor: FC = () => {
  const [name, setName] = useState('Arsalan Malik');
  const [phone, setPhone] = useState('+971 50 123 4567');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <EditorCard data-testid="personal-details-inline-editor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, color: 'var(--accent-red, #EF4444)' }}>📝 Personal & Corporate Details</h4>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          style={{ background: 'var(--accent-red, #EF4444)', color: 'var(--white, #FFF)', border: 'none', borderRadius: '6px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
        >
          {isEditing ? 'Save Changes' : 'Edit Details'}
        </button>
      </div>

      <FieldRow>
        <span style={{ fontSize: '0.82rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Full Name</span>
        {isEditing ? <input value={name} onChange={(e) => setName(e.target.value)} /> : <span style={{ fontWeight: 800 }}>{name}</span>}
      </FieldRow>
      <FieldRow>
        <span style={{ fontSize: '0.82rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Mobile Contact</span>
        {isEditing ? <input value={phone} onChange={(e) => setPhone(e.target.value)} /> : <span style={{ fontWeight: 800 }}>{phone}</span>}
      </FieldRow>
      <FieldRow>
        <span style={{ fontSize: '0.82rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Role & Title</span>
        <span style={{ color: 'var(--accent-red, #EF4444)', fontWeight: 900 }}>Managing Director (Level 5 Superuser)</span>
      </FieldRow>
    </EditorCard>
  );
};

export default PersonalDetailsInlineEditor;
