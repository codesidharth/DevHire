import React, { useEffect, useState } from "react";
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
          setError(
            err.response?.data?.detail ||
              "Failed to load profile."
          );
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
      [name]:
        name === "experience_years"
          ? Number(value)
          : value,
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
      setError(
        err.response?.data?.detail ||
          "Failed to save profile."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-lg animate-pulse">
          Loading Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Candidate Profile
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your professional profile.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500 bg-red-900/20 text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500 bg-emerald-900/20 text-emerald-300">
            {success}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          {profileExists && !isEditing && (
            <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                  Verification Status
                </div>

                <div className="text-white font-medium">
                  Active Candidate Profile
                </div>
              </div>

              <div className="h-3 w-3 rounded-full bg-blue-400 animate-pulse"></div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block mb-2 text-sm text-slate-400">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-400">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-400">
                Experience (Years)
              </label>

              <input
                type="number"
                name="experience_years"
                value={profile.experience_years}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-400">
                Skills
              </label>

              <textarea
                name="skills"
                rows="4"
                value={profile.skills}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
              />
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
                    {profileExists
                      ? "Save Changes"
                      : "Create Profile"}
                  </button>
                </>
              )}

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;