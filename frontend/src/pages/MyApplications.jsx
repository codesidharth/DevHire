import React, { useEffect, useState } from "react";
import API from "../api/axios";

const statusColors = {
  applied:     "bg-blue-900/40 border-blue-700/40 text-blue-300",
  reviewing:   "bg-yellow-900/40 border-yellow-700/40 text-yellow-300",
  shortlisted: "bg-purple-900/40 border-purple-700/40 text-purple-300",
  rejected:    "bg-red-900/40 border-red-700/40 text-red-300",
  hired:       "bg-emerald-900/40 border-emerald-700/40 text-emerald-300",
};
const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [jobsMap, setJobsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appRes, jobRes] = await Promise.all([
          API.get("/applications/my-applications"),
          API.get("/jobs/")
        ]);
        setApplications(appRes.data || []);
        const map = {};
        (jobRes.data || []).forEach((job) => { map[job.id] = job; });
        setJobsMap(map);
      } catch (err) {
        console.error("Applications fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading Applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-slate-400 mb-8">Track the status of your job applications.</p>

        {applications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400">
            No applications yet. Go to the Jobs Feed to apply.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const job = jobsMap[app.job_id];
              const statusKey = app.status?.toLowerCase() || "applied";
              return (
                <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {job?.title || "Unknown Position"}
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">
                        {job?.location || "Remote"} · ₹{job?.salary?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${statusColors[statusKey] || statusColors.pending}`}>
                      {app.status || "Pending"}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-3">Application ID: #{app.id}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;