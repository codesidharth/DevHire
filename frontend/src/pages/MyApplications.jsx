import React, { useEffect, useState } from "react";
import API from "../api/axios";

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

        const apps = appRes.data || [];
        const jobs = jobRes.data || [];

        setApplications(apps);

        // map jobs by id
        const map = {};
        jobs.forEach((job) => {
          map[job.id] = job;
        });

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
      <div className="text-white p-10">Loading Applications...</div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-400">No applications yet</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = jobsMap[app.job_id];

            return (
              <div
                key={app.id}
                className="bg-slate-900 p-4 rounded border border-slate-800"
              >
                <h2 className="text-lg font-semibold">
                  {job?.title || "Unknown Position"}
                </h2>

                <p className="text-sm text-gray-400">
                  {job?.location || "Remote"}
                </p>

                <span className="inline-block mt-2 text-xs bg-blue-600 px-2 py-1 rounded">
                  {app.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;