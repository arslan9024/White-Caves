import React from 'react';
import zxcvbn from 'zxcvbn';

interface Props {
  password: string;
}

const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];

const PasswordStrength: React.FC<Props> = ({ password }) => {
  const result = zxcvbn(password);
  const score = result.score; // 0-4
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
