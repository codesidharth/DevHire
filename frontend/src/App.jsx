import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';

import JobsFeed from './pages/JobsFeed';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';

import RecruiterDashboard from './pages/recruiter/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-white">

          <Navbar />

          <Routes>

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Candidate Routes */}

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

            {/* Recruiter Routes */}

            <Route
              path="/recruiter-dashboard"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>

        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;