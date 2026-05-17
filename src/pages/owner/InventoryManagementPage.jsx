import React from 'react';
import { InventoryDashboard } from '../../components/dashboard/InventoryDashboard';
import './InventoryManagementPage.css';

const InventoryManagementPage = () => {
  return (
    <div className="inventory-management-page">
      <InventoryDashboard />
    </div>
  );
};

export default InventoryManagementPage;
