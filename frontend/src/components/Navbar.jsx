import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-4 sticky top-0 z-50 shadow-md font-sans">
      <div className="max-w-5xl mx-auto flex justify-between items-center">

        {/* Platform Branding */}
        <div
          onClick={() => navigate('/jobs')}
          className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent cursor-pointer tracking-tight"
        >
          DevHire Matrix
        </div>

        {/* Action Links Row */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/jobs')}
            className={`text-sm font-medium transition-colors ${
              isActive('/jobs') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Positions Feed
          </button>

          {/* 🎯 CHANGED THIS BUTTON TEXT TO MATCH YOUR SPECIFICATIONS */}
          <button
            onClick={() => navigate('/my-applications')}
            className={`text-sm font-medium transition-colors ${
              isActive('/my-applications') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Jobs Applied
          </button>

          <button
            onClick={() => navigate('/profile')}
            className={`text-sm font-medium transition-colors ${
              isActive('/profile') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Profile
          </button>

          <span className="h-4 w-[1px] bg-slate-800"></span>

          <button
            onClick={handleLogout}
            className="text-xs font-semibold tracking-wide uppercase border border-slate-700 hover:border-slate-500 hover:bg-slate-850 px-3 py-1.5 rounded-lg transition-all text-slate-300"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;