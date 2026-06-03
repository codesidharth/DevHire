import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const registrationPayload = {
      email: email.trim().toLowerCase(),
      password: password,
      role: role
    };

    // 🎯 CHOOSE YOUR BACKEND PATH PREFERENCE HERE:
    // If Option 1 throws a 404, change this variable to '/auth/register'
    const targetEndpoint = '/auth/register';

    try {
      console.log(`Transmitting registration packet directly to: ${targetEndpoint}`);

      await API.post(targetEndpoint, registrationPayload);

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error("Registration endpoint failed:", err);
      setError(err.response?.data?.detail || 'Registration configuration failed. Please check endpoint paths.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-6 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Join DevHire to manage your professional pipeline
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-200 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-900/40 border border-emerald-500 text-emerald-200 p-3 rounded-lg text-sm text-center">
              Account created successfully! Routing to login portal...
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
            >
              <option value="candidate">Candidate (Looking for jobs)</option>
              <option value="recruiter">Recruiter (Hiring talent)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Profile'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-400">
            {"Already have an account? "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;