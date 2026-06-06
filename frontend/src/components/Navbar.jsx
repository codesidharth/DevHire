import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-4 sticky top-0 z-50 shadow-md">

      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <div
          onClick={() =>
            navigate(
              user?.role === 'recruiter'
                ? '/recruiter-dashboard'
                : '/jobs'
            )
          }
          className="cursor-pointer text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
        >
          DevHire
        </div>

        <div className="flex items-center gap-6">

          {user?.role === 'candidate' && (
            <>
              <button
                onClick={() => navigate('/jobs')}
                className={
                  isActive('/jobs')
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-white'
                }
              >
                Positions Feed
              </button>

              <button
                onClick={() => navigate('/my-applications')}
                className={
                  isActive('/my-applications')
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-white'
                }
              >
                My Applications
              </button>

              <button
                onClick={() => navigate('/profile')}
                className={
                  isActive('/profile')
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-white'
                }
              >
                My Profile
              </button>
            </>
          )}

          {user?.role === 'recruiter' && (
            <>
              <button
                onClick={() => navigate('/recruiter-dashboard')}
                className={
                  isActive('/recruiter-dashboard')
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-white'
                }
              >
                Dashboard
              </button>
            </>
          )}

          <div className="h-5 w-px bg-slate-700"></div>

          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs font-semibold uppercase border border-slate-700 rounded-lg hover:bg-slate-800"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;