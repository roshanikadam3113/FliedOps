import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AppLayout from './layouts/AppLayout';
import PlaceholderPage from './components/common/PlaceholderPage';
import ProtectedRoute from './components/common/ProtectedRoute';

// Customer Portal Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CreateRequest from './pages/customer/CreateRequest';
import MyRequests from './pages/customer/MyRequests';
import TrackService from './pages/customer/TrackService';
import ServiceHistory from './pages/customer/ServiceHistory';
import MyInvoices from './pages/customer/MyInvoices';
import ServiceReviews from './pages/customer/ServiceReviews';
import CustomerProfile from './pages/customer/CustomerProfile';
import HelpSupport from './pages/customer/HelpSupport';

// Technician Portal Pages
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianJobs from './pages/technician/TechnicianJobs';
import ActiveJob from './pages/technician/ActiveJob';
import TechnicianHistory from './pages/technician/TechnicianHistory';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequests from './pages/admin/AdminRequests';
import AdminJobs from './pages/admin/AdminJobs';
import AdminDispatch from './pages/admin/AdminDispatch';
import AdminTechnicians from './pages/admin/AdminTechnicians';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminInventory from './pages/admin/AdminInventory';
import AdminAIInsights from './pages/admin/AdminAIInsights';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSmartAssignment from './pages/admin/AdminSmartAssignment';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReviews from './pages/admin/AdminReviews';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            
            {/* Module 1: Public Landing / Home Page */}
            <Route path="/" element={<Home />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Common FieldOps Application Shell Layout Routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              
              {/* COMPANY ADMIN ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['admin']}><Outlet /></ProtectedRoute>}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route 
                  path="/admin/dashboard" 
                  element={<AdminDashboard />} 
                />
                <Route 
                  path="/admin/live-operations" 
                  element={<PlaceholderPage title="Live Operations" subtitle="Monitor active jobs and technician activity" category="Overview" />} 
                />
                <Route 
                  path="/admin/requests" 
                  element={<AdminRequests />} 
                />
                <Route 
                  path="/admin/jobs" 
                  element={<AdminJobs />} 
                />

                <Route 
                  path="/admin/smart-assignment" 
                  element={<AdminSmartAssignment />} 
                />
                <Route 
                  path="/admin/technicians" 
                  element={<AdminTechnicians />} 
                />
                <Route 
                  path="/admin/customers" 
                  element={<AdminCustomers />} 
                />
                <Route 
                  path="/admin/inventory" 
                  element={<AdminInventory />} 
                />
                <Route 
                  path="/admin/invoices" 
                  element={<AdminInvoices />} 
                />
                <Route 
                  path="/admin/ai-insights" 
                  element={<AdminAIInsights />} 
                />
                <Route 
                  path="/admin/payments" 
                  element={<AdminPayments />} 
                />
                <Route 
                  path="/admin/reviews" 
                  element={<AdminReviews />} 
                />
                <Route 
                  path="/admin/analytics" 
                  element={<AdminAnalytics />} 
                />
                <Route 
                  path="/admin/notifications" 
                  element={<AdminNotifications />} 
                />
                <Route 
                  path="/admin/settings" 
                  element={<AdminSettings />} 
                />
              </Route>

              {/* TECHNICIAN ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['technician']}><Outlet /></ProtectedRoute>}>
                <Route path="/technician" element={<Navigate to="/technician/dashboard" replace />} />
                <Route 
                  path="/technician/dashboard" 
                  element={<TechnicianDashboard />} 
                />
                <Route 
                  path="/technician/jobs" 
                  element={<TechnicianJobs />} 
                />
                <Route 
                  path="/technician/active-job" 
                  element={<ActiveJob />} 
                />
                <Route 
                  path="/technician/history" 
                  element={<TechnicianHistory />} 
                />
              </Route>

              {/* CUSTOMER ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['customer']}><Outlet /></ProtectedRoute>}>
                <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
                <Route 
                  path="/customer/dashboard" 
                  element={<CustomerDashboard />} 
                />
                <Route 
                  path="/customer/create-request" 
                  element={<CreateRequest />} 
                />
                <Route 
                  path="/customer/requests" 
                  element={<MyRequests />} 
                />
                <Route 
                  path="/customer/track" 
                  element={<TrackService />} 
                />
                <Route 
                  path="/customer/history" 
                  element={<ServiceHistory />} 
                />
                <Route 
                  path="/customer/invoices" 
                  element={<MyInvoices />} 
                />
                <Route 
                  path="/customer/reviews" 
                  element={<ServiceReviews />} 
                />
                <Route 
                  path="/customer/profile" 
                  element={<CustomerProfile />} 
                />
                <Route 
                  path="/customer/support" 
                  element={<HelpSupport />} 
                />
              </Route>

            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
