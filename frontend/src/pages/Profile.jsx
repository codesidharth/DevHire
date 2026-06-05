import React, { useEffect, useState, useRef } from "react";
import API from "../api/axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    skills: "",
    experience_years: 0,
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profiles/me");
        setProfile(res.data);
        setProfileExists(true);
        setIsEditing(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setProfileExists(false);
          setIsEditing(true);
        } else {
          setError(err.response?.data?.detail || "Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "experience_years" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      let res;
      if (profileExists) {
        res = await API.put("/profiles/me", profile);
        setSuccess("Profile updated successfully.");
      } else {
        res = await API.post("/profiles/", profile);
        setSuccess("Profile created successfully.");
      }
      setProfile(res.data);
      setProfileExists(true);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save profile.");
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setResumeError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File size must not exceed 5MB.");
      return;
    }
    setResumeFile(file);
    setResumeError("");
  };

  const handleUploadResume = async () => {
    if (!resumeFile) return;
    setUploadingResume(true);
    setResumeError("");
    setResumeSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", resumeFile);
      const res = await API.post("/profiles/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setResumeSuccess("Resume uploaded successfully!");
      setTimeout(() => setResumeSuccess(""), 3000);
    } catch (err) {
      setResumeError(err.response?.data?.detail || "Upload failed.");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDownloadResume = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://codesidharth-devhire.hf.space/api/v1/profiles/resume/download",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my_resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setResumeError("Download failed. The file may no longer exist on the server.");
    } finally {
      setDownloading(false);
    }
  };

  const skillsList = profile.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-lg animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Candidate Profile</h1>
          <p className="text-slate-400 mt-2">Manage your professional profile and resume.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500 bg-red-900/20 text-red-300">{error}</div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500 bg-emerald-900/20 text-emerald-300">{success}</div>
        )}

        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">

          {profileExists && !isEditing && (
            <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Verification Status</div>
                <div className="text-white font-medium">Active Candidate Profile</div>
              </div>
              <div className="h-3 w-3 rounded-full bg-blue-400 animate-pulse"></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm text-slate-400">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white disabled:opacity-60"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-400">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-400">Experience (Years)</label>
              <input
                type="number"
                name="experience_years"
                value={profile.experience_years}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-400">
                Skills <span className="text-slate-600 text-xs">(comma separated)</span>
              </label>
              <textarea
                name="skills"
                rows="3"
                value={profile.skills}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. Python, SQL, Power BI, Excel"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white disabled:opacity-60 resize-none"
              />
              {!isEditing && skillsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skillsList.map((skill, i) => (
                    <span key={i} className="bg-blue-900/40 border border-blue-700/40 text-blue-300 text-xs px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-medium"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  {profileExists && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl font-medium"
                  >
                    {profileExists ? "Save Changes" : "Create Profile"}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Resume Card */}
        {profileExists && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-1">Resume</h2>
            <p className="text-slate-400 text-sm mb-6">Upload your resume in PDF format (max 5MB).</p>

            {resumeError && (
              <div className="mb-4 p-3 rounded-xl border border-red-500 bg-red-900/20 text-red-300 text-sm">{resumeError}</div>
            )}
            {resumeSuccess && (
              <div className="mb-4 p-3 rounded-xl border border-emerald-500 bg-emerald-900/20 text-emerald-300 text-sm">{resumeSuccess}</div>
            )}

            {/* Current resume status */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-2xl">📄</div>
              <div className="flex-1">
                {profile.resume_path ? (
                  <>
                    <div className="text-white font-medium text-sm">Resume uploaded</div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {profile.resume_path.split("/").pop()}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-slate-400 font-medium text-sm">No resume uploaded</div>
                    <div className="text-slate-600 text-xs mt-0.5">Upload a PDF to let recruiters find you</div>
                  </>
                )}
              </div>
              {profile.resume_path && (
                <button
                  onClick={handleDownloadResume}
                  disabled={downloading}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  {downloading ? "Downloading..." : "⬇ Download"}
                </button>
              )}
            </div>

            {/* Upload */}
            <div className="space-y-3">
              <label className="block text-sm text-slate-400">
                {profile.resume_path ? "Replace Resume" : "Upload Resume"}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleResumeChange}
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer"
              />
              {resumeFile && (
                <div className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-3">
                  <div>
                    <div className="text-white text-sm font-medium">{resumeFile.name}</div>
                    <div className="text-slate-400 text-xs">{(resumeFile.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button
                    onClick={handleUploadResume}
                    disabled={uploadingResume}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    {uploadingResume ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;