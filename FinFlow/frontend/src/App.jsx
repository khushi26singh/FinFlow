import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LoanProducts from './pages/customer/LoanProducts';
import EMICalculator from './pages/customer/EMICalculator';
import ApplyLoan from './pages/customer/ApplyLoan';
import LoanHistory from './pages/customer/LoanHistory';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import Applications from './pages/admin/Applications';
import AdminLoanProducts from './pages/admin/LoanProducts';
import AdminUsers from './pages/admin/Users';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loan-products"
            element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <LoanProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply-loan"
            element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <ApplyLoan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loan-history"
            element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <LoanHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emi-calculator"
            element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <EMICalculator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="loan-products" element={<AdminLoanProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;