import React from 'react';
import { WidgetContainer, MatrixTable, Badge } from './FinanceRBACWidget.style';
import { useFinanceRBACLogic } from './FinanceRBACWidget.logic';
import { Shield } from 'lucide-react';

export const FinanceRBACWidget: React.FC = () => {
  const { t, isRtl, permissions, matrixKeys, matrix } = useFinanceRBACLogic();
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <Shield size={32} color="var(--color-3b82f6, #3B82F6)" />
      </div>
      <MatrixTable>
        <thead><tr><th>Permission</th>{matrixKeys.map(r => <th key={r}>{r}</th>)}</tr></thead>
        <tbody>
          {permissions.map((perm: string, idx: number) => (
            <tr key={perm}>
              <td>{perm}</td>
              {matrixKeys.map(role => (
                <td key={role}><Badge $granted={matrix[role][idx]}>{matrix[role][idx] ? t.granted : t.denied}</Badge></td>
              ))}
            </tr>
          ))}
        </tbody>
      </MatrixTable>
    </WidgetContainer>
  );
};
