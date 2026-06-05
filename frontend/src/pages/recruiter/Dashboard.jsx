import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "https://codesidharth-devhire.hf.space/api/v1";

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({ active_jobs: 0, applications: 0, interviews: 0 });
  const [myJobs, setMyJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/jobs/stats`, { headers });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get(`${API}/jobs/?page=1&limit=50`, { headers });
      // Filter to only jobs posted by this recruiter
      const token_payload = JSON.parse(atob(token.split(".")[1]));
      const myId = token_payload.id;
      setMyJobs(res.data.filter(job => job.recruiter_id === myId));
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchMyJobs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePostJob = async () => {
    if (!form.title || !form.description || !form.location || !form.salary) {
      alert("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/jobs/`, {
        title: form.title,
        description: form.description,
        location: form.location,
        salary: parseInt(form.salary),
      }, { headers });

      setSuccessMsg("Job posted successfully!");
      setForm({ title: "", description: "", location: "", salary: "" });
      setShowForm(false);
      // Refresh stats and jobs list
      await fetchStats();
      await fetchMyJobs();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error posting job:", err);
      alert("Failed to post job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axios.delete(`${API}/jobs/${jobId}`, { headers });
      await fetchStats();
      await fetchMyJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold">Recruiter Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
          >
            {showForm ? "Cancel" : "+ Post a Job"}
          </button>
        </div>
        <p className="text-slate-400 mb-8">Manage jobs, applicants, and hiring activities.</p>

        {/* Success message */}
        {successMsg && (
          <div className="bg-emerald-900 border border-emerald-600 text-emerald-300 px-4 py-3 rounded-lg mb-6">
            {successMsg}
          </div>
        )}

        {/* Post Job Form */}
        {showForm && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Job Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Data Analyst"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Salary (₹)</label>
                <input
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. 600000"
                  type="number"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 text-sm mb-1 block">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the role, requirements, and responsibilities..."
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            <button
              onClick={handlePostJob}
              disabled={submitting}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              {submitting ? "Posting..." : "Post Job"}
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold">Active Jobs</h3>
            <p className="text-4xl mt-3 text-blue-400">{stats.active_jobs}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold">Applications</h3>
            <p className="text-4xl mt-3 text-emerald-400">{stats.applications}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold">Interviews</h3>
            <p className="text-4xl mt-3 text-yellow-400">{stats.interviews}</p>
          </div>
        </div>

        {/* My Jobs List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Posted Jobs</h2>
          {myJobs.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              No jobs posted yet. Click "+ Post a Job" to get started.
            </div>
          ) : (
            <div className="grid gap-4">
              {myJobs.map(job => (
                <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{job.location} · ₹{job.salary?.toLocaleString()}</p>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2">{job.description}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${
                      job.is_active ? "bg-emerald-900 text-emerald-400" : "bg-slate-700 text-slate-400"
                    }`}>
                      {job.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="ml-4 text-red-400 hover:text-red-300 text-sm font-medium shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RecruiterDashboard;