import React from 'react';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { ActiveViewProvider } from './contexts/ActiveViewContext';
import Login from './Login';
import MainLayout from './MainLayout';
import './workspace.css';

/**
 * CRMWorkspace.jsx — Root Orchestrator
 *
 * Single import point for the entire workspace module.
 * Wraps everything in AuthProvider + ActiveViewProvider.
 *
 * When isAuthenticated = false → renders Login
 * When isAuthenticated = true  → renders MainLayout (Sidebar + Viewport)
 *
 * Usage:
 *   import CRMWorkspace from './components/workspace/CRMWorkspace';
 *   // In a route: <Route path="/workspace" element={<CRMWorkspace />} />
 *   // Or standalone: <CRMWorkspace />
 */

function WorkspaceGate() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <ActiveViewProvider>
      <MainLayout />
    </ActiveViewProvider>
  );
}

export default function CRMWorkspace() {
  return (
    <AuthProvider>
      <WorkspaceGate />
    </AuthProvider>
  );
}
