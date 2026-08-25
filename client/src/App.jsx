import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

// Technician Portal Pages
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianJobs from './pages/technician/TechnicianJobs';
import ActiveJob from './pages/technician/ActiveJob';
import TechnicianHistory from './pages/technician/TechnicianHistory';

export default function App() {
  return (
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
                element={<PlaceholderPage title="Company Dashboard" subtitle="Overall business & fleet operations overview" category="Overview" />} 
              />
              <Route 
                path="/admin/live-operations" 
                element={<PlaceholderPage title="Live Operations" subtitle="Monitor active jobs and technician activity" category="Overview" />} 
              />
              <Route 
                path="/admin/requests" 
                element={<PlaceholderPage title="Service Requests" subtitle="Manage incoming customer requests & triage queue" category="Service Operations" />} 
              />
              <Route 
                path="/admin/jobs" 
                element={<PlaceholderPage title="Jobs Management" subtitle="Manage scheduled and active field jobs" category="Service Operations" />} 
              />
              <Route 
                path="/admin/dispatch" 
                element={<PlaceholderPage title="Dispatch Console" subtitle="Manage technician dispatch and field routes" category="Service Operations" />} 
              />
              <Route 
                path="/admin/smart-assignment" 
                element={<PlaceholderPage title="Smart Assignment" subtitle="AI technician recommendations by proximity and skill" category="Service Operations" />} 
              />
              <Route 
                path="/admin/technicians" 
                element={<PlaceholderPage title="Technicians Management" subtitle="Manage company technicians and credentials" category="People" />} 
              />
              <Route 
                path="/admin/customers" 
                element={<PlaceholderPage title="Customers Directory" subtitle="Manage customers and service history" category="People" />} 
              />
              <Route 
                path="/admin/inventory" 
                element={<PlaceholderPage title="Inventory Management" subtitle="Manage parts stock across van fleet & warehouse" category="Business" />} 
              />
              <Route 
                path="/admin/invoices" 
                element={<PlaceholderPage title="Invoices & Billing" subtitle="Manage generated invoices & PDF records" category="Business" />} 
              />
              <Route 
                path="/admin/payments" 
                element={<PlaceholderPage title="Payments Reconciliation" subtitle="Track payment status and transactions" category="Business" />} 
              />
              <Route 
                path="/admin/reviews" 
                element={<PlaceholderPage title="Customer Reviews" subtitle="Monitor customer feedback and ratings" category="Insights" />} 
              />
              <Route 
                path="/admin/analytics" 
                element={<PlaceholderPage title="Operational Analytics" subtitle="Business performance, KPIs, and SLAs" category="Insights" />} 
              />
              <Route 
                path="/admin/notifications" 
                element={<PlaceholderPage title="System Notifications" subtitle="System alerts and operational activity log" category="System" />} 
              />
              <Route 
                path="/admin/settings" 
                element={<PlaceholderPage title="Company Settings" subtitle="Configure company parameters and dispatch rules" category="System" />} 
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
            </Route>

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
