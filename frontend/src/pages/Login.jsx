import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      // 🚀 Step 1: Authenticate with the live Hugging Face backend endpoint
      const loginResponse = await API.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token } = loginResponse.data;

      // Store the token immediately so the subsequent profile lookup is authorized
      localStorage.setItem('token', access_token);
      API.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // 🚀 Step 2: Query the backend dependency injection profile endpoint
      console.log("Fetching authenticated user profile matrix from /me...");
      const userResponse = await API.get('/me');

      const { role, email: userEmail } = userResponse.data;
      console.log("SUCCESSFULLY FETCHED PROFILE MATRIX:", userResponse.data);

      // 🚀 Step 3: Synchronize user data across your system caches
      const userPayload = {
        email: userEmail || email,
        role: role
      };
      localStorage.setItem('user', JSON.stringify(userPayload));

      // Push credentials directly into your global React context state
      login(access_token, role);

      // 🚀 Step 4: Role-Based Access Control (RBAC) Route Redirection
      if (role === 'recruiter') {
        navigate('/dashboard');
      } else {
        navigate('/jobs');
      }

    } catch (err) {
      console.error("Authentication process rejected:", err);
      setError(err.response?.data?.detail || 'Invalid login credentials. Please try again.');

      // Clean up partial storage items to protect app health states on failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-6 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Welcome to DevHire
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Sign in to access your dashboard
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-200 p-3 rounded-lg text-sm text-center">
              {error}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-400">
            {"Don't have an account? "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;