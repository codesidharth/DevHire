import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

      const response = await API.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('LOGIN RESPONSE:', response.data);

      const { access_token, role } = response.data;

      login(access_token, role);

      if (role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/jobs');
      }

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">

      {/* Branding */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          DevHire
        </h1>

        <p className="text-slate-400 mt-2">
          AI-Powered Job Portal Platform
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">

        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-400 hover:underline font-semibold"
          >
            Sign up here
          </button>
        </div>

      </div>

    </div>
  );
};

export default Login;