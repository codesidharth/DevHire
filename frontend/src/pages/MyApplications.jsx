import React, { useEffect, useState } from 'react';
import API from '../api/axios'; // 🎯 Ensure this path correctly points to your axios.js file!

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
        setLoading(true);
        setError("");
        // Connects to your live Hugging Face application portal tracking endpoint
        const response = await API.get('/applications/my-applications');
        setApplications(response.data || []);
      } catch (err) {
        console.error("Error syncing application tracking portfolio:", err);
        setError(err.response?.data?.detail || "Failed to parse tracking metrics from the cluster node.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatrixData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-sm font-mono tracking-widest animate-pulse">SYNCING TRACKING PORTFOLIO...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Your Applied Positions Matrix</h1>
        <p className="text-slate-400 text-sm mb-8">Monitor live application tracking metrics and automated pipeline state transitions.</p>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-sm">You haven't dispatched any operational applications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center hover:border-slate-700/60 transition-all shadow-md"
              >
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {app.job?.title || "Position Reference Open"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Company Platform Node • {app.job?.location || "Remote"}
                  </p>
                </div>
                <div>
                  <span className={`text-xs uppercase tracking-wider font-mono font-semibold px-3 py-1 rounded-md ${
                    app.status === 'shortlisted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    app.status === 'rejected' ? 'bg-red-950 text-red-400 border border-red-800' :
                    'bg-blue-950 text-blue-400 border border-blue-800'
                  } border`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;