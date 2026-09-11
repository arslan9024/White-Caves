import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

const RBAC_MATRIX: Record<string, boolean[]> = {
  'Viewer':   [true, false, false, false, true, false, false, false],
  'Editor':   [true, true,  true,  false, true, true,  false, false],
  'Approver': [true, true,  true,  true,  true, true,  true,  false],
  'Admin':    [true, true,  true,  true,  true, true,  true,  true],
};

export const useFinanceRBACLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;
  return { t, isRtl, roles: t.roles, permissions: t.permissions, matrix: RBAC_MATRIX, matrixKeys: Object.keys(RBAC_MATRIX) };
};
