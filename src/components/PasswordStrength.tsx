import React from 'react';

interface Props {
  password: string;
}

const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;
const strengthColors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'] as const;

function computePasswordScore(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password || password.length < 6) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
}

const PasswordStrength: React.FC<Props> = ({ password }) => {
  const score = computePasswordScore(password);
  const width = ((score + 1) / 5) * 100;
  const label = strengthLabels[score];
  const color = strengthColors[score];

  return (
    <div className="password-strength" style={{ marginTop: '8px' }}>
      <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px' }}>
        <div
          style={{
            width: `${width}%`,
            height: '100%',
            background: color,
            borderRadius: '3px',
            transition: 'width 0.3s',
          }}
        />
      </div>
      <small style={{ color, marginTop: '4px', display: 'block' }}>{label}</small>
    </div>
  );
};

export default PasswordStrength;
