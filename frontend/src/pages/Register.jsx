import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'candidate' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          DevHire Matrix
        </h1>
        <p className="text-slate-400 mt-2">Create your account</p>
      </div>

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>}
          <input name="username" placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} required className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white" />
          <input name="email" type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white" />
          <input name="password" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white" />
          <select name="role" onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white">
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold">
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline font-semibold">
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;