import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const CreateJob = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    salary_range: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // 🚀 FEATURE 2: Connected directly to your POST /jobs backend route
      await API.post('/jobs/', jobData);

      setSuccess("Job posting deployed to candidate pipelines successfully!");
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error("Job compilation error:", err);
      setError(err.response?.data?.detail || "Schema validation rejected database write operation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs uppercase tracking-wider font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Recruiter Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-2">Publish New Job Tracking Node</h1>
          <p className="text-slate-400 text-sm mt-1">Populate details to spin up an active position accessible by all candidate accounts.</p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-900/40 border border-emerald-500 text-emerald-200 p-4 rounded-xl mb-6 text-sm">
            {success}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm"
                  placeholder="e.g. Data Analyst"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={jobData.company}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm"
                  placeholder="e.g. DevHire Matrix Corporation"
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Job Location</label>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm"
                  placeholder="e.g. Bangalore / Remote"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Comp Package (Salary Range)</label>
                <input
                  type="text"
                  name="salary_range"
                  value={jobData.salary_range}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm font-mono"
                  placeholder="e.g. 6 - 8 LPA"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Requirements / Stack Expectations</label>
              <input
                type="text"
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm font-mono"
                placeholder="e.g. SQL, Python, Power BI, Advanced Excel"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Comprehensive Job Description</label>
              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                rows="4"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm leading-relaxed"
                placeholder="Detail core day-to-day data engineering operations and metrics layout..."
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-xl transition-all disabled:opacity-50 tracking-wide text-sm"
              >
                {loading ? "Deploying Code to Feed..." : "Deploy Active Position Link"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default CreateJob;