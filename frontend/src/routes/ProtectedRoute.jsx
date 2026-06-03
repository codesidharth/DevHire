import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // If the user isn't logged in at all, redirect them straight back to login screen
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-Based Access Control (RBAC): Check if user role matches endpoint clearance criteria
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If a candidate accidentally accesses a recruiter dashboard, bounce them to /jobs
    return <Navigate to={user.role === 'recruiter' ? '/dashboard' : '/jobs'} replace />;
  }

  // If validation clearances pass cleanly, render the requested page view
  return children;
};

export default ProtectedRoute;