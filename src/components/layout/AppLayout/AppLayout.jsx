import React from 'react';
import AppLayout from '../AppLayout';

/**
 * @deprecated Compatibility wrapper kept for legacy imports.
 * Canonical CRM shell is: src/components/layout/AppLayout.tsx
 */
const DashboardAppLayout = ({ children }) => {
  return <AppLayout>{children}</AppLayout>;
};

export default DashboardAppLayout;
