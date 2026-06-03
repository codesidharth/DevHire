import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Needed for page switching
import API from '../api/axios';

const JobsFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 Initializing navigation router engine

  // 1. Fetch live jobs on component mount (with trailing slash matching backend)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await API.get('/jobs/');
        setJobs(response.data);
      } catch (err) {
        console.error('Jobs fetch error:', err);
        setError(err.response?.data?.detail || 'Failed to retrieve active job openings.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // 2. Submit candidate application tracking row parameter (NO trailing slash)
  const handleApply = async (jobId) => {
    try {
      const response = await API.post(`/applications/${jobId}`);
      alert('Application submitted successfully to tracking matrix!');
    } catch (err) {
      console.error('Job submission execution error:', err);
      // Handles your backend's custom "already applied" 400 exception error message cleanly
      alert(err.response?.data?.detail || 'Failed to submit application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-xl font-medium animate-pulse tracking-wide">Loading position listings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* 🎯 HEADER ROW WITH ACTION BUTTON */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Available Positions</h1>
            <p className="text-slate-400 mt-1">Explore live cloud and analytics roles matching your profile.</p>
          </div>

          <button
            onClick={() => navigate('/my-applications')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 whitespace-nowrap"
          >
            View My Applications →
          </button>
        </div>

        {/* System Monitoring Connection Status Block */}
        <div className="flex justify-end mb-6">
          <span className="text-xs text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md font-mono">
            Connected to: codesidharth-devhire Backend
          </span>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            No positions are currently open. Please check back later.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-slate-700">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md">
                      Full-Time
                    </span>
                    <span className="text-slate-600 text-xs font-mono">ID: {job.id}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{job.company}</p>

                  <div className="text-sm space-y-1 text-slate-400 mb-6">
                    <p>📍 <span className="text-slate-300">Location:</span> {job.location || 'Bangalore'}</p>
                    <p>💰 <span className="text-slate-300">Compensation:</span> {job.salary || '600000'}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {job.description || 'Looking for a graduate proficient in Python, SQL, and Power BI to analyze data streams.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleApply(job.id)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-all"
                >
                  Apply for Position
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsFeed;