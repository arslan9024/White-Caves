import React, { FC, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppShell } from './components/layout/AppShell';
import { PageLoader } from './components/layout/PageLoader';

// Lazy loaded chunks
const HomeView = lazy(() => import('./views/HomeView'));
const MarketingView = lazy(() => import('./views/MarketingView'));
const SalesView = lazy(() => import('./views/SalesView'));
const OffPlanView = lazy(() => import('./views/OffPlanView'));
const DocumentsView = lazy(() => import('./views/DocumentsView'));
const SettingsView = lazy(() => import('./views/SettingsView'));
const FeatureStatusView = lazy(() => import('./views/FeatureStatusView'));

export const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={
            <Suspense fallback={<PageLoader />}><HomeView /></Suspense>
          } />
          <Route path="marketing" element={
            <Suspense fallback={<PageLoader />}><MarketingView /></Suspense>
          } />
          <Route path="sales" element={
            <Suspense fallback={<PageLoader />}><SalesView /></Suspense>
          } />
          <Route path="off-plan" element={
            <Suspense fallback={<PageLoader />}><OffPlanView /></Suspense>
          } />
          <Route path="documents" element={
            <Suspense fallback={<PageLoader />}><DocumentsView /></Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<PageLoader />}><SettingsView /></Suspense>
          } />
          <Route path="feature-status" element={
            <Suspense fallback={<PageLoader />}><FeatureStatusView /></Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
