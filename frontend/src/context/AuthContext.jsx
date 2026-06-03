import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Initialize the Context Channel
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores { token: string, role: string }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user session data is already cached in browser storage from a prior login
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      setUser({ token, role });
    }
    setLoading(false);
  }, []);

  // Login handler: Sets global memory state and persists data in the browser cache
  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setUser({ token, role });
  };

  // Logout handler: Flushes out auth state cache instantly
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom React Hook to consume Auth state easily inside our UI components
export const useAuth = () => {
  return useContext(AuthContext);
};