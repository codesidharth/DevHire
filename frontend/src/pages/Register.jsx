import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'candidate'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', formData);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          DevHire
        </h1>
        <p className="text-slate-400 mt-2">Create your account</p>
      </div>

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">{error}</div>
          )}
          {success && (
            <div className="text-emerald-400 text-sm bg-emerald-900/20 p-3 rounded">{success}</div>
          )}

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Role selector with visual cards */}
          <div>
            <label className="block text-slate-400 text-sm mb-2"> </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'candidate' })}
                className={`p-3 rounded-lg border text-sm font-medium transition ${
                  formData.role === 'candidate'
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                }`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                className={`p-3 rounded-lg border text-sm font-medium transition ${
                  formData.role === 'recruiter'
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                }`}
              >
                Recruiter
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded font-bold transition-all"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:underline font-semibold"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;