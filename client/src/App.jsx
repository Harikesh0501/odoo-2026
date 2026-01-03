import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Attendance from './pages/Attendance';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  console.log('PrivateRoute check:', { isAuthenticated, loading });

  if (loading) return <div>Loading...</div>; // Or a spinner

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        {/* Placeholders for other routes */}
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leaves" element={<div className="p-4">Leaves Page (Coming Soon)</div>} />
        <Route path="/payroll" element={<div className="p-4">Payroll Page (Coming Soon)</div>} />
        <Route path="/organization" element={<div className="p-4">Organization Page (Coming Soon)</div>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
