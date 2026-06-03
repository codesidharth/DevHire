import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import JobsFeed from './pages/JobsFeed';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

// 🚀 Phase 3 Recruiter Imports
import RecruiterDashboard from './pages/recruiter/Dashboard';
import CreateJob from './pages/recruiter/CreateJob';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* Public Auth Targets */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Candidate Territory */}
          <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <JobsFeed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 🎯 Secure Recruiter Operations (Mock Swapped for Live Ecosystem) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-job"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <CreateJob />
              </ProtectedRoute>
            }
          />

          {/* Fallback Root Catch-All Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;