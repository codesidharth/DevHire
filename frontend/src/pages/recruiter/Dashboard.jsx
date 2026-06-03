import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    applicationsReceived: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // 🚀 Pulling jobs matrix straight from your FastAPI backend
        const response = await API.get('/jobs/');
        const jobsList = response.data || [];

        // Aggregating database records safely
        setAnalytics({
          totalJobs: jobsList.length,
          activeJobs: jobsList.length, // Defaults to match list size gracefully
          applicationsReceived: 0       // Will increment dynamically when we assemble Feature 4!
        });

      } catch (err) {
        console.error("Error synchronizing recruiter metrics:", err);
        setError("Failed to synchronize dashboard metrics from the data cluster.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-xl font-medium animate-pulse tracking-wide">Assembling Recruiter Console...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Welcome Block */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Recruiter Command Workspace</h1>
          <p className="text-slate-400 mt-1">Publish open career tracks and manage your incoming developer application pipelines.</p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* 📊 FEATURE 1: METRICS DISPLAY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total Job Roles Posted</span>
            <div className="text-4xl font-mono font-bold text-blue-400">{analytics.totalJobs}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Active Headcount Tunnels</span>
            <div className="text-4xl font-mono font-bold text-emerald-400">{analytics.activeJobs}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total Applications Received</span>
            <div className="text-4xl font-mono font-bold text-indigo-400">{analytics.applicationsReceived}</div>
          </div>

        </div>

        {/* Workspace Quick Actions */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Pipeline Control Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Click routes recruiter cleanly into Feature 2 Form */}
            <div
              onClick={() => navigate('/create-job')}
              className="p-4 border border-slate-800 rounded-xl bg-slate-950/50 hover:border-blue-500/50 transition-all cursor-pointer group"
            >
              <h3 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">Create New Positions</h3>
              <p className="text-xs text-slate-400 mt-1">Publish an active job listing straight onto the live Candidate Job Feed.</p>
            </div>

            <div className="p-4 border border-slate-800 rounded-xl bg-slate-950/50 hover:border-indigo-500/50 transition-all cursor-not-allowed opacity-60">
              <h3 className="font-semibold text-slate-300 text-sm">Review Incoming Applicants (Feature 4)</h3>
              <p className="text-xs text-slate-500 mt-1">Inspect candidate core metrics, phone profiles, and change candidate tracking statuses.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruiterDashboard;