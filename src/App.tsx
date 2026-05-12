/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useStore } from './store/useStore';
import SidebarLayout from './components/layout/SidebarLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveTelemetry from './pages/LiveTelemetry';
import BatteryTwin from './pages/BatteryTwin';
import AnomalyAlerts from './pages/AnomalyAlerts';
import Prediction from './pages/Prediction';
import FleetVehicles from './pages/FleetVehicles';
import OwnerMobile from './pages/OwnerMobile';
import HealthReport from './pages/HealthReport';
import Architecture from './pages/Architecture';
import Settings from './pages/Settings';
import { Toaster } from './components/ui/sonner';
import GuidedDemo from './components/GuidedDemo';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { currentUser } = useStore();
  
  if (!currentUser) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'Vehicle Owner') return <Navigate to="/owner" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { currentUser, isSimulating, updateTelemetry } = useStore();

  useEffect(() => {
    let interval: number;
    if (isSimulating) {
      interval = window.setInterval(() => {
        updateTelemetry();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, updateTelemetry]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            currentUser ? <Navigate to={currentUser.role === 'Vehicle Owner' ? '/owner' : '/'} replace /> : <Login />
          } />
          
          <Route element={<ProtectedRoute><SidebarLayout /></ProtectedRoute>}>
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['Fleet Admin', 'OEM Engineer', 'Service Technician']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/telemetry" element={
              <ProtectedRoute allowedRoles={['Fleet Admin', 'OEM Engineer', 'Service Technician']}>
                <LiveTelemetry />
              </ProtectedRoute>
            } />
            <Route path="/twin" element={
              <ProtectedRoute allowedRoles={['Fleet Admin', 'OEM Engineer', 'Service Technician']}>
                <BatteryTwin />
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute allowedRoles={['Fleet Admin', 'OEM Engineer', 'Service Technician']}>
                <AnomalyAlerts />
              </ProtectedRoute>
            } />
            <Route path="/prediction" element={
              <ProtectedRoute allowedRoles={['Fleet Admin', 'OEM Engineer']}>
                <Prediction />
              </ProtectedRoute>
            } />
            <Route path="/fleet" element={
              <ProtectedRoute allowedRoles={['Fleet Admin', 'Service Technician']}>
                <FleetVehicles />
              </ProtectedRoute>
            } />
            <Route path="/owner" element={
               <ProtectedRoute allowedRoles={['Vehicle Owner']}>
                <OwnerMobile />
              </ProtectedRoute>
            } />
            <Route path="/report" element={<HealthReport />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
        <GuidedDemo />
      </BrowserRouter>
      <Toaster theme="dark" />
    </>
  );
}
