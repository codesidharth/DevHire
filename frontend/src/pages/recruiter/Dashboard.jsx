import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "https://codesidharth-devhire.hf.space/api/v1";

const statusColors = {
  applied:     "bg-blue-900/40 border-blue-700/40 text-blue-300",
  reviewing:   "bg-yellow-900/40 border-yellow-700/40 text-yellow-300",
  shortlisted: "bg-purple-900/40 border-purple-700/40 text-purple-300",
  rejected:    "bg-red-900/40 border-red-700/40 text-red-300",
  hired:       "bg-emerald-900/40 border-emerald-700/40 text-emerald-300",
};

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({ active_jobs: 0, applications: 0, interviews: 0 });
  const [myJobs, setMyJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({ title: "", description: "", location: "", salary: "" });

  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [candidateProfiles, setCandidateProfiles] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(null);

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
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const myId = tokenPayload.id;
      setMyJobs(res.data.filter(job => job.recruiter_id === myId));
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchApplicants = async (job) => {
    setSelectedJob(job);
    setLoadingApplicants(true);
    setCandidateProfiles({});
    try {
      const res = await axios.get(`${API}/applications/job/${job.id}`, { headers });
      setApplicants(res.data || []);
      const profiles = {};
      await Promise.all(
        res.data.map(async (app) => {
          try {
            const profileRes = await axios.get(
              `${API}/applications/candidate/${app.candidate_id}/profile`,
              { headers }
            );
            profiles[app.candidate_id] = profileRes.data;
          } catch {
            profiles[app.candidate_id] = null;
          }
        })
      );
      setCandidateProfiles(profiles);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      await axios.patch(
        `${API}/applications/${applicationId}/status`,
        { status: newStatus },
        { headers }
      );
      setApplicants(prev =>
        prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app)
      );
      await fetchStats();
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDownloadResume = async (candidateId, candidateName) => {
    try {
      const response = await fetch(
        `${API}/profiles/resume/download/${candidateId}`,
        { headers }
      );
      if (!response.ok) throw new Error("No resume available");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${candidateName || "candidate"}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Resume not available for this candidate.");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchMyJobs();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      await fetchStats();
      await fetchMyJobs();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axios.delete(`${API}/jobs/${jobId}`, { headers });
      if (selectedJob?.id === jobId) setSelectedJob(null);
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
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition">
            {showForm ? "Cancel" : "+ Post a Job"}
          </button>
        </div>
        <p className="text-slate-400 mb-8">Manage jobs, applicants, and hiring activities.</p>

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
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Data Analyst"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Location</label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Salary (₹)</label>
                <input name="salary" value={form.salary} onChange={handleChange}
                  placeholder="e.g. 600000" type="number"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 text-sm mb-1 block">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe the role..." rows={4}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
              </div>
            </div>
            <button onClick={handlePostJob} disabled={submitting}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition">
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

        {/* Two column layout */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* My Jobs */}
          <div>
            <h2 className="text-2xl font-bold mb-4">My Posted Jobs</h2>
            {myJobs.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                No jobs posted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myJobs.map(job => (
                  <div key={job.id}
                    className={`bg-slate-900 border rounded-xl p-5 cursor-pointer transition ${
                      selectedJob?.id === job.id ? "border-blue-500" : "border-slate-800 hover:border-slate-600"
                    }`}
                    onClick={() => fetchApplicants(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{job.title}</h3>
                        <p className="text-slate-400 text-sm mt-1">
                          {job.location} · ₹{job.salary?.toLocaleString()}
                        </p>
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${
                          job.is_active ? "bg-emerald-900 text-emerald-400" : "bg-slate-700 text-slate-400"
                        }`}>
                          {job.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteJob(job.id); }}
                        className="text-red-400 hover:text-red-300 text-sm font-medium shrink-0 ml-2">
                        Delete
                      </button>
                    </div>
                    {selectedJob?.id === job.id && (
                      <p className="text-blue-400 text-xs mt-2">Viewing applicants ↓</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applicants Panel */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {selectedJob ? `Applicants — ${selectedJob.title}` : "Applicants"}
            </h2>

            {!selectedJob ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                Click on a job to view applicants.
              </div>
            ) : loadingApplicants ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 animate-pulse">
                Loading applicants...
              </div>
            ) : applicants.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                No applicants yet for this job.
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map(app => {
                  const profile = candidateProfiles[app.candidate_id];
                  const statusKey = app.status?.toLowerCase() || "applied";
                  return (
                    <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">
                            {profile?.full_name || `Candidate #${app.candidate_id}`}
                          </h3>
                          {profile && (
                            <>
                              <p className="text-slate-400 text-sm mt-0.5">
                                {profile.experience_years} yr{profile.experience_years !== 1 ? "s" : ""} experience
                              </p>
                              {profile.skills && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {profile.skills.split(",").slice(0, 4).map((s, i) => (
                                    <span key={i} className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full">
                                      {s.trim()}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {profile?.has_resume ? (
                          <button
                            onClick={() => handleDownloadResume(app.candidate_id, profile?.full_name)}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition shrink-0 ml-2">
                            ⬇ Resume
                          </button>
                        ) : (
                          <span className="text-slate-600 text-xs shrink-0 ml-2">No resume</span>
                        )}
                      </div>

                      {/* Status update */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border capitalize ${statusColors[statusKey] || statusColors.applied}`}>
                          {app.status || "applied"}
                        </span>
                        <select
                          value={app.status || "applied"}
                          disabled={updatingStatus === app.id}
                          onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                          className="ml-auto bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        >
                          <option value="applied">Applied</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="hired">Hired</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;