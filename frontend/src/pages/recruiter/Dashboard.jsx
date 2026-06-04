import React from "react";

const RecruiterDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Recruiter Dashboard
        </h1>

        <p className="text-slate-400 mb-8">
          Manage jobs, applicants, and hiring activities.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold">
              Active Jobs
            </h3>

            <p className="text-4xl mt-3 text-blue-400">
              0
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold">
              Applications
            </h3>

            <p className="text-4xl mt-3 text-emerald-400">
              0
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold">
              Interviews
            </h3>

            <p className="text-4xl mt-3 text-yellow-400">
              0
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;