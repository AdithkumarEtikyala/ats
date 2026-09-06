import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TicketProvider } from './contexts/TicketContext';
import { HotelProvider } from './contexts/HotelContext';
import ProtectedRoute from './components/ProtectedRoute';
import { FeedbackProvider } from './contexts/FeedbackContext';
import Feedback from './pages/Feedback';

// Layouts
import MainLayout from './layouts/MainLayout';
import SessionLayout from './layouts/SessionLayout';

// Public Pages
import LandingPage from './pages/LandingPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import RegisterPage from './pages/auth/RegisterPage';

// Operation Pages
import Dashboard from './pages/Dashboard';
import Hotels from './pages/Hotels';
import Bookings from './pages/Bookings';
import Tickets from './pages/Tickets';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import HotelOwners from './pages/HotelOwners';

// Guest Portal Pages
import GuestPortal from './pages/GuestPortal';

const STAFF_ROLES = ['Super Admin', 'Hotel Owner', 'Manager', 'Front Desk', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Security'];

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <TicketProvider>
          <HotelProvider>
            <FeedbackProvider>
              <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/guest-auth" element={<Navigate to="/register?type=guest" replace />} />
                <Route
                  path="/register"
                  element={
                    <SessionLayout>
                      <RegisterPage />
                    </SessionLayout>
                  }
                />

                {/* Public Auth Routes wrapped in SessionLayout */}
                <Route
                  path="/login"
                  element={
                    <SessionLayout>
                      <LoginPage />
                    </SessionLayout>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <SessionLayout>
                      <ForgotPasswordPage />
                    </SessionLayout>
                  }
                />

                {/* Guest Portal (Protected) */}
                <Route
                  path="/guest"
                  element={
                    <ProtectedRoute allowedRoles={['Guest']}>
                      <GuestPortal />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Main Layout Staff routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={STAFF_ROLES}>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hotels"
                  element={
                    <ProtectedRoute allowedRoles={['Super Admin', 'Hotel Owner']}>
                      <MainLayout>
                        <Hotels />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hotel-owners"
                  element={
                    <ProtectedRoute allowedRoles={['Super Admin']}>
                      <MainLayout>
                        <HotelOwners />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute allowedRoles={['Super Admin', 'Hotel Owner', 'Manager', 'Front Desk']}>
                      <MainLayout>
                        <Bookings />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tickets"
                  element={
                    <ProtectedRoute allowedRoles={STAFF_ROLES}>
                      <MainLayout>
                        <Tickets />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute allowedRoles={['Super Admin', 'Hotel Owner', 'Manager', 'Front Desk']}>
                      <MainLayout>
                        <Staff />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={['Super Admin', 'Hotel Owner', 'Manager']}>
                      <MainLayout>
                        <Reports />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feedback"
                  element={
                    <ProtectedRoute allowedRoles={['Super Admin', 'Hotel Owner', 'Manager', 'Front Desk']}>
                      <MainLayout>
                        <Feedback />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={STAFF_ROLES}>
                      <MainLayout>
                        <SettingsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Catch all fallback redirects to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </FeedbackProvider>
          </HotelProvider>
        </TicketProvider>
      </AuthProvider>
    </Router>
  );
}
