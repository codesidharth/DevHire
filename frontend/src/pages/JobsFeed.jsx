import React, { useEffect, useState } from "react";
import API from "../api/axios";

const JobsFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  // ---------------- FETCH JOBS ----------------
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await API.get("/jobs/?page=1&limit=10");
      setJobs(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH APPLIED JOBS ----------------
  const fetchAppliedJobs = async () => {
    try {
      const res = await API.get("/applications/my-applications");

      const appliedIds = res.data.map((app) => app.job_id);
      setAppliedJobs(appliedIds);
    } catch (err) {
      console.log("Failed to fetch applied jobs", err);
    }
  };

  // ---------------- APPLY ----------------
  const handleApply = async (jobId) => {
    try {
      await API.post(`/applications/${jobId}`);

      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (err) {
      const msg = err.response?.data?.detail;

      // already applied → treat as success state
      if (msg?.toLowerCase().includes("already")) {
        setAppliedJobs((prev) => [...prev, jobId]);
        return;
      }

      alert(msg || "Failed to apply for job");
    }
  };

  // ---------------- UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Jobs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Jobs Feed</h1>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center"
          >
            {/* LEFT SIDE */}
            <div>
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-slate-400 text-sm">
                {job.location || "Remote"}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                ₹ {job.salary?.toLocaleString() || "N/A"}
              </p>
            </div>

            {/* RIGHT SIDE BUTTON */}
            {appliedJobs.includes(job.id) ? (
              <button
                disabled
                className="px-4 py-2 bg-green-600 text-white rounded-lg opacity-70 cursor-not-allowed"
              >
                Applied ✓
              </button>
            ) : (
              <button
                onClick={() => handleApply(job.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsFeed;