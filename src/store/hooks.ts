/**
 * Redux Hooks
 * Custom hooks for accessing Redux state and dispatching actions
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Custom hooks for specific slices
 */

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  return { ...auth, dispatch };
};

export const useLeads = () => {
  const dispatch = useAppDispatch();
  const leads = useAppSelector(state => state.leads);
  return { ...leads, dispatch };
};

export const useProperties = () => {
  const dispatch = useAppDispatch();
  const properties = useAppSelector(state => state.properties);
  return { ...properties, dispatch };
};

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector(state => state.dashboard);
  return { ...dashboard, dispatch };
};

export const useUI = () => {
  const dispatch = useAppDispatch();
  const ui = useAppSelector(state => state.ui);
  return { ...ui, dispatch };
};
